import { Injectable, Inject } from '@nestjs/common';
import { Between, ILike, Repository } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { Product } from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { Customer } from '../entities/Customer.entity';
import { Supplier } from '../entities/Supplier.entity';
import { REPOSITORIES } from '../constants';
import * as xlsx from 'xlsx';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPOSITORIES.INVOICE)
    private readonly invoiceRepository: Repository<Invoice>,
    @Inject(REPOSITORIES.INVOICE_DETAIL)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @Inject(REPOSITORIES.PRODUCT)
    private readonly productRepository: Repository<Product>,
    @Inject(REPOSITORIES.USER)
    private readonly userRepository: Repository<User>,
    @Inject(REPOSITORIES.CUSTOMER)
    private readonly customerRepository: Repository<Customer>,
    @Inject(REPOSITORIES.SUPPLIER)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async getSalesReportByDateRange(startDate: string, endDate: string): Promise<Invoice[]> {
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

    const localStart = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
    const localEnd = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

    return this.invoiceRepository.find({
      where: {
        date: Between(localStart, localEnd),
      },
      relations: ['customer', 'user', 'invoiceDetails', 'invoiceDetails.product'],
    });
  }

  async generateSalesReportExcel(data: Invoice[]): Promise<Buffer> {
    const reportData = data.flatMap(invoice =>
      invoice.invoiceDetails.map(detail => ({
        'Factura ID': invoice.idInvoice,
        'Fecha': invoice.date,
        'Cliente': invoice.customer.customerName,
        'Vendedor': invoice.user.name,
        'Producto': detail.product.productName,
        'Cantidad': detail.quantity,
        'Precio Unitario': detail.unitPrice,
        'Subtotal': detail.subtotal,
        'Total Factura': invoice.total,
      }))
    );

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Reporte de Ventas');

    return Buffer.from(xlsx.write(workbook, { type: 'array', bookType: 'xlsx' }));
  }

  async getSalesByCustomerReport(customerIdentification: string): Promise<Invoice[]> {
    if(!customerIdentification){
      return [];
    }
    const customer = await this.customerRepository.findOne({ where: { identification: customerIdentification } });
    if (!customer) {
      return [];
    }
    return this.invoiceRepository.find({
      where: {
        customer: { idCustomer: customer.idCustomer },
      },
      relations: ['customer', 'user', 'invoiceDetails', 'invoiceDetails.product'],
    });
  }

  async generateSalesByCustomerReportExcel(data: Invoice[]): Promise<Buffer> {
    const reportData = data.flatMap(invoice =>
      invoice.invoiceDetails.map(detail => ({
        'Factura ID': invoice.idInvoice,
        'Fecha': invoice.date,
        'Cliente': invoice.customer.customerName,
        'Vendedor': invoice.user.name,
        'Producto': detail.product.productName,
        'Cantidad': detail.quantity,
        'Precio Unitario': detail.unitPrice,
        'Subtotal': detail.subtotal,
        'Total Factura': invoice.total,
      }))
    );

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Ventas por Cliente');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async getSalesByProductReport(productCode: string): Promise<InvoiceDetail[]> {
    const product = await this.productRepository.findOne({ where: { code: productCode } });
    if (!product) {
      return [];
    }
    return this.invoiceDetailRepository.find({
      where: {
        product: { code: productCode },
      },
      relations: ['invoice', 'invoice.customer', 'invoice.user', 'product'],
    });
  }

  async generateSalesByProductReportExcel(data: InvoiceDetail[]): Promise<Buffer> {
    const reportData = data.map(detail => ({
      'Factura ID': detail.invoice.idInvoice,
      'Fecha': detail.invoice.date,
      'Cliente': detail.invoice.customer.customerName,
      'Producto': detail.product.productName,
      'Cantidad': detail.quantity,
      'Precio Unitario': detail.unitPrice,
      'Subtotal': detail.subtotal,
    }));

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Ventas por Producto');

    return Buffer.from(xlsx.write(workbook, { type: 'array', bookType: 'xlsx' }));
  }

  async getInventoryReport(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'supplier', 'inventoryMovements'],
    });
  }

  async generateInventoryReportExcel(data: Product[]): Promise<Buffer> {
    const reportData = data.map(product => ({
      'ID': product.idProduct,
      'Producto': product.productName,
      'Código': product.code,
      'Stock Actual': product.stock,
      'Precio Compra': product.purchasePrice,
      'Precio Venta': product.sellingPrice,
      'Categoría': product?.category?.categoryName || '',
      'Proveedor': product?.supplier?.supplierName || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Reporte de Inventario');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async getProductsBySupplierReport(supplierName: string): Promise<Product[]> {
    const supplier = await this.supplierRepository.findOne({ where: { supplierName: ILike(`%${supplierName}%`) } });
    if (!supplier) {
      return [];
    }
    return this.productRepository.find({
      where: {
        supplier: { idSupplier: supplier.idSupplier },
      },
      relations: ['category', 'supplier'],
    });
  }

  async generateProductsBySupplierReportExcel(data: Product[]): Promise<Buffer> {
    const reportData = data.map(product => ({
      'Producto': product.productName,
      'Código': product.code,
      'Stock Actual': product.stock,
      'Precio Compra': product.purchasePrice,
      'Precio Venta': product.sellingPrice,
      'Categoría': product?.category?.categoryName || '',
    }));

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Productos por Proveedor');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async getUsersReport(identification?: string): Promise<User[]> {
    if (identification) {
      return this.userRepository.find({
        where: { identification },
        relations: ['role'],
      });
    }
    return this.userRepository.find({
      relations: ['role'],
    });
  }

  async generateUsersReportExcel(data: User[]): Promise<Buffer> {
    const reportData = data.map(user => ({
      'ID de Usuario': user.idUser,
      'Nombre': user.name,
      'Telefono': user.phone,
      'Correo Electronico': user.email,
      'Identificación': user.identification,
      'Rol': user.role.roleName,
    }));

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Reporte de Usuarios');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
