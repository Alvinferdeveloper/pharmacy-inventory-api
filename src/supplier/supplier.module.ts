import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { DatabaseModule } from '../database/database.module';
import { supplierProviders } from '../providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [SupplierService, ...supplierProviders],
})
export class SupplierModule { }
