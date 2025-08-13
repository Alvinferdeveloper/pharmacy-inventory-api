import { DataSource } from 'typeorm';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { REPOSITORIES, DATA_SOURCE } from '../constants';

export const invoiceDetailProviders = [
  {
    provide: REPOSITORIES.INVOICE_DETAIL,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(InvoiceDetail),
    inject: [DATA_SOURCE],
  },
];
