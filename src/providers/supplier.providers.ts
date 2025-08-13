import { DataSource } from 'typeorm';
import { Supplier } from '../entities/Supplier.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const supplierProviders = [
  {
    provide: REPOSITORIES.SUPPLIER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Supplier),
    inject: [DATA_SOURCE],
  },
];
