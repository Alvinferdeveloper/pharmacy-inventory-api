import { Injectable, Inject } from '@nestjs/common';
import { Repository, Between, ILike } from 'typeorm';
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
      where.product = { code: ILike(`%${productCode.trim()}%`) };
    }

    if (startDate && endDate) {
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

      const localStart = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
      const localEnd = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

      where.date = Between(localStart, localEnd);
    }

    return this.inventoryMovementRepository.find({
      where,
      relations: ['product'],
      order: { date: 'DESC' },
      withDeleted: true,
    });
  }
}
