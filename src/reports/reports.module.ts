import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DatabaseModule } from '../database/database.module';
import { invoiceProviders, invoiceDetailProviders, productProviders, userProviders, customerProviders, supplierProviders } from '../providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportsController],
  providers: [ReportsService, ...invoiceProviders, ...invoiceDetailProviders, ...productProviders, ...userProviders, ...customerProviders, ...supplierProviders],
})
export class ReportsModule { }
