import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../database/database.module';
import { productProviders } from '../providers';
import { categoryProviders } from '../providers/category.providers';
import { supplierProviders } from '../providers/supplier.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, ...productProviders, ...categoryProviders, ...supplierProviders],
})
export class ProductModule { }
