import { Connection } from 'typeorm';
import { OrderHistoryExport } from './entities/order-history-export.entity';

export const orderHistoryExportProviders = [
  {
    provide: 'ORDERHISTORYEXPORT_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(OrderHistoryExport),
    inject: ['DATABASE_CONNECTION'],
  },
];
