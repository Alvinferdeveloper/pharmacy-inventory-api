import { Injectable, Inject, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { InventoryMovement, MovementType } from '../entities/InventoryMovement.entity';
import { Product } from '../entities/Product.entity';
import { Customer } from '../entities/Customer.entity';
import { User } from '../entities/User.entity';
import { RoleName } from '../entities/Role.entity'; // Import RoleName
import { REPOSITORIES, DATA_SOURCE } from '../constants';
import { BadRequestException } from '@nestjs/common';
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
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto, userId: number): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { customerId, products } = createInvoiceDto;

      const customer = await this.customerRepository.findOne({ where: { idCustomer: customerId } });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      if (customer.deletedAt) {
        throw new BadRequestException('Cannot create an invoice for an inactive customer');
      }

      const user = await this.userRepository.findOne({ where: { idUser: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let total = 0;
      const productsToUpdate: { product: Product, quantity: number }[] = [];

      for (const productDto of products) {
        const product = await this.productRepository.findOne({ where: { idProduct: productDto.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${productDto.productId} not found`);
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
        tax: 0, // Assuming tax is calculated elsewhere or is 0
        discount: 0, // Assuming discount is calculated elsewhere or is 0
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

  async findAll(date?: string): Promise<Invoice[]> {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.user', 'user')
      .leftJoinAndSelect('invoice.invoiceDetails', 'invoiceDetails')
      .leftJoinAndSelect('invoiceDetails.product', 'product');
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      const localStart = new Date(year, month - 1, day, 0, 0, 0, 0);
      const localEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

      return query.where({ date: Between(localStart, localEnd) }).orderBy({ 'invoice.idInvoice': 'DESC' }).getMany();
    }
    return query.orderBy({ 'invoice.idInvoice': 'DESC' }).getMany();
  }

  async findMyInvoices(userId: number): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { user: { idUser: userId } },
      relations: ['customer', 'user', 'invoiceDetails', 'invoiceDetails.product'],
      order: { idInvoice: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { idInvoice: id }, relations: ['customer', 'user', 'invoiceDetails', 'invoiceDetails.product'], withDeleted: true });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async remove(id: number, currentUser: Express.User): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({ where: { idInvoice: id }, relations: ['user'] });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const userIsAdmin = currentUser.roles.includes(RoleName.ADMINISTRATOR);
    const userIsOwner = invoice.user.idUser === currentUser.idUser;

    if (!userIsAdmin && !userIsOwner) {
      throw new ForbiddenException('You are not authorized to delete this invoice.');
    }

    await this.invoiceRepository.softDelete(id);
  }
}
