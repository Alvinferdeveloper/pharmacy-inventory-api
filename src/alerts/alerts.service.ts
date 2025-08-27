import { Injectable, Inject } from '@nestjs/common';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { REPOSITORIES } from '../constants';

@Injectable()
export class AlertsService {
  constructor(
    @Inject(REPOSITORIES.PRODUCT)
    private readonly productRepository: Repository<Product>,
  ) { }

  async getLowStockProducts(threshold = 5): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        stock: LessThanOrEqual(threshold),
      },
      order: {
        stock: 'ASC',
      },
    });
  }
}
