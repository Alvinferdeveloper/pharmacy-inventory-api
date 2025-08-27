import { Injectable, Inject } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InventoryMovement } from '../entities/InventoryMovement.entity';
import { REPOSITORIES } from '../constants';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @Inject(REPOSITORIES.INVENTORY_MOVEMENT)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>,
  ) { }

  async findAll(productCode?: string, startDate?: string, endDate?: string): Promise<InventoryMovement[]> {
    const where: any = {};

    if (productCode) {
      where.product = { code: productCode };
    }

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    }

    return this.inventoryMovementRepository.find({
      where,
      relations: ['product'],
      order: { date: 'DESC' },
    });
  }
}
