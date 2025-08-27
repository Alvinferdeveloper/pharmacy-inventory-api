import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesModule } from './roles/roles.module';
import { ReportsModule } from './reports/reports.module';
import { BackupRestoreModule } from './backup-restore/backup-restore.module';
import { InventoryMovementsModule } from './inventory-movements/inventory-movements.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    CategoryModule,
    UserModule,
    SupplierModule,
    ProductModule,
    CustomerModule,
    InvoiceModule,
    DashboardModule,
    RolesModule,
    ReportsModule,
    BackupRestoreModule,
    InventoryMovementsModule,
    AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }