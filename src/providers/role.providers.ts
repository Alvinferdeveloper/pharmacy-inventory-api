import { DataSource } from 'typeorm';
import { Role } from '../entities/Role.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const roleProviders = [
  {
    provide: REPOSITORIES.ROLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: [DATA_SOURCE],
  },
];
