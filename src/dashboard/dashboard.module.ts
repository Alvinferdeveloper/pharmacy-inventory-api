
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DatabaseModule } from '../database/database.module';
import { invoiceProviders, productProviders, invoiceDetailProviders } from '../providers';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    ...invoiceProviders,
    ...productProviders,
    ...invoiceDetailProviders,
  ],
})
export class DashboardModule {}
