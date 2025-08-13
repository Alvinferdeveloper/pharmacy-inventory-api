import { DataSource } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const invoiceProviders = [
  {
    provide: REPOSITORIES.INVOICE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Invoice),
    inject: [DATA_SOURCE],
  },
];
