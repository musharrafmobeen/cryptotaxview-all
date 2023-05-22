import { Connection } from 'typeorm';
import { OrderHistoryImport } from './entities/order-history-import.entity';

export const orderHistoryImportProviders = [
  {
    provide: 'ORDERHISTORYIMPORT_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(OrderHistoryImport),
    inject: ['DATABASE_CONNECTION'],
  },
];
