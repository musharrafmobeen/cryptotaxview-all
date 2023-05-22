import { Invoice } from './entities/invoice.entity';
import { Connection } from 'typeorm';

export const invoiceProviders = [
  {
    provide: 'INVOICE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Invoice),
    inject: ['DATABASE_CONNECTION'],
  },
];
