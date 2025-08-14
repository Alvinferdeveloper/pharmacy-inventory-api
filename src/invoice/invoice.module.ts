import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { invoiceProviders, invoiceDetailProviders, inventoryMovementProviders, productProviders, customerProviders, userProviders } from '../providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoiceController],
  providers: [
    InvoiceService, 
    ...invoiceProviders, 
    ...invoiceDetailProviders, 
    ...inventoryMovementProviders, 
    ...productProviders,
    ...customerProviders,
    ...userProviders
  ],
})
export class InvoiceModule {}
