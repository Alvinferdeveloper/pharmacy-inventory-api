import { Module } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { InventoryMovementsController } from './inventory-movements.controller';
import { inventoryMovementProviders } from '../providers/inventoryMovement.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InventoryMovementsController],
  providers: [InventoryMovementsService, ...inventoryMovementProviders],
  exports: [InventoryMovementsService]
})
export class InventoryMovementsModule { }
