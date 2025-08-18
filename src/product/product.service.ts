import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { REPOSITORIES } from '../constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BadRequestException } from '@nestjs/common';
import { Category } from '../entities/Category.entity';
import { Supplier } from '../entities/Supplier.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORIES.PRODUCT)
    private readonly productRepository: Repository<Product>,
    @Inject(REPOSITORIES.CATEGORY)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REPOSITORIES.SUPPLIER)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productExists = await this.productRepository.findOne({ where: { code: createProductDto.code } });
    if (productExists) {
      throw new ConflictException(`Product with code ${createProductDto.code} already exists`);
    }
    const category = await this.categoryRepository.findOne({ where: { idCategory: createProductDto.idCategory } });
    const supplier = await this.supplierRepository.findOne({ where: { idSupplier: createProductDto.idSupplier } });
    if (!category || !supplier) {
      throw new NotFoundException(`Category or supplier not found`);
    }
    const product = this.productRepository.create({
      ...createProductDto,
      category,
      supplier,
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'supplier'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { idProduct: id }, relations: ['category', 'supplier'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { idProduct: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (updateProductDto.code && updateProductDto.code != product.code) {
      const productByCode = await this.productRepository.findOne({ where: { code: updateProductDto.code } })
      if (productByCode && productByCode?.idProduct != product.idProduct) {
        throw new ConflictException(`Product with code ${updateProductDto.code} already exists`);
      }
    }
    const updateData: Partial<Product> = { ...updateProductDto };


    if (updateProductDto.idCategory !== undefined) {
      const category = await this.categoryRepository.findOne({
        where: { idCategory: updateProductDto.idCategory },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateProductDto.idCategory} not found`);
      }
      updateData.category = category;
    }

    if (updateProductDto.idSupplier !== undefined) {
      const supplier = await this.supplierRepository.findOne({
        where: { idSupplier: updateProductDto.idSupplier },
      });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${updateProductDto.idSupplier} not found`);
      }
      updateData.supplier = supplier;
    }

    await this.productRepository.save({ idProduct: id, ...updateData });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.softDelete(id);
  }
}
