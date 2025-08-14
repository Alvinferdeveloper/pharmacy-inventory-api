import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { InventoryMovement, MovementType } from '../entities/InventoryMovement.entity';
import { Product } from '../entities/Product.entity';
import { Customer } from '../entities/Customer.entity';
import { User } from '../entities/User.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(REPOSITORIES.INVOICE)
    private readonly invoiceRepository: Repository<Invoice>,
    @Inject(REPOSITORIES.INVOICE_DETAIL)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @Inject(REPOSITORIES.INVENTORY_MOVEMENT)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>,
    @Inject(REPOSITORIES.PRODUCT)
    private readonly productRepository: Repository<Product>,
    @Inject(REPOSITORIES.CUSTOMER)
    private readonly customerRepository: Repository<Customer>,
    @Inject(REPOSITORIES.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: number): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { idCustomer, products } = createInvoiceDto;

      const customer = await this.customerRepository.findOne({ where: { idCustomer: idCustomer } });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const user = await this.userRepository.findOne({ where: { idUser: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let total = 0;
      const productsToUpdate: { product: Product, quantity: number }[] = [];

      for (const productDto of products) {
        const product = await this.productRepository.findOne({ where: { idProduct: productDto.idProduct } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${productDto.idProduct} not found`);
        }
        if (product.stock < productDto.quantity) {
          throw new ConflictException(`Not enough stock for product ${product.productName}`);
        }
        total += product.sellingPrice * productDto.quantity;
        productsToUpdate.push({ product, quantity: productDto.quantity });
      }

      const invoice = this.invoiceRepository.create({
        customer,
        user,
        total,
        tax: 0, 
        discount: 0,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      for (const { product, quantity } of productsToUpdate) {
        const invoiceDetail = this.invoiceDetailRepository.create({
          invoice: savedInvoice,
          product,
          quantity,
          unitPrice: product.sellingPrice,
          subtotal: product.sellingPrice * quantity,
        });
        await queryRunner.manager.save(invoiceDetail);

        const inventoryMovement = this.inventoryMovementRepository.create({
          product,
          quantity,
          movementType: MovementType.OUT,
          reason: `Sale - Invoice #${savedInvoice.idInvoice}`,
        });
        await queryRunner.manager.save(inventoryMovement);

        product.stock -= quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
      return savedInvoice;
    } catch (error) {      
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
