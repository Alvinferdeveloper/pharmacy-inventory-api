import { DataSource } from 'typeorm';
import { InventoryMovement } from '../entities/InventoryMovement.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const inventoryMovementProviders = [
  {
    provide: REPOSITORIES.INVENTORY_MOVEMENT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(InventoryMovement),
    inject: [DATA_SOURCE],
  },
];
