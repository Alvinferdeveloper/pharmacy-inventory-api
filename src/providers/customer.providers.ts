import { DataSource } from 'typeorm';
import { Customer } from '../entities/Customer.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const customerProviders = [
  {
    provide: REPOSITORIES.CUSTOMER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Customer),
    inject: [DATA_SOURCE],
  },
];
