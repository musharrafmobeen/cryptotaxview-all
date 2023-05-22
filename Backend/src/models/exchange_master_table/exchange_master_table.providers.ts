import { Connection } from 'typeorm';
import { ExchangeMasterTable } from './entities/exchange_master_table.entity';

export const exchangeMasterTableProviders = [
  {
    provide: 'EXCHANGE_Master_Table_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(ExchangeMasterTable),
    inject: ['DATABASE_CONNECTION'],
  },
];
