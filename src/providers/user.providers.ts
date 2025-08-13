import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const userProviders = [
  {
    provide: REPOSITORIES.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
