import { DataSource } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const productProviders = [
  {
    provide: REPOSITORIES.PRODUCT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DATA_SOURCE],
  },
];
