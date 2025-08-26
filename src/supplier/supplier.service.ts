import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/Supplier.entity';
import { REPOSITORIES } from '../constants';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(REPOSITORIES.SUPPLIER)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({ order: { idSupplier: "DESC" } });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { idSupplier: id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    await this.supplierRepository.update(id, updateSupplierDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.supplierRepository.softDelete(id);
  }
}
