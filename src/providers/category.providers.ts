import { DataSource } from 'typeorm';
import { Category } from '../entities/Category.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const categoryProviders = [
  {
    provide: REPOSITORIES.CATEGORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DATA_SOURCE],
  },
];