import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '../entities/Customer.entity';
import { REPOSITORIES } from '../constants';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(REPOSITORIES.CUSTOMER)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({ where: { identification: createCustomerDto.identification } });
    if (existingCustomer) {
      throw new ConflictException('Customer with this identification already exists');
    }
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { idCustomer: id } });
    if (!customer) {
      throw new ConflictException('Customer not found');
    }
    return customer;
  }
  s
  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new ConflictException('Customer not found');
    }
    if (updateCustomerDto.identification && updateCustomerDto.identification !== customer.identification) {
      const existingCustomer = await this.customerRepository.findOne({ where: { identification: updateCustomerDto.identification } });
      if (existingCustomer) {
        throw new ConflictException('Customer with this identification already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.softDelete(id);
  }

  async search(term: string): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.customerName LIKE :term', { term: `%${term}%` })
      .orWhere('customer.identification LIKE :term', { term: `%${term}%` })
      .getMany();
  }
}
