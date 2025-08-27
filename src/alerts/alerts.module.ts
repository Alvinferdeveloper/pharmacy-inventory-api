import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { productProviders } from '../providers/product.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AlertsController],
  providers: [AlertsService, ...productProviders],
  exports: [AlertsService]
})
export class AlertsModule { }
