import { Vouchershistory } from './entities/vouchersHistory.entity';
import { Connection } from 'typeorm';

export const vouchersHistoryProviders = [
  {
    provide: 'VOUCHERSHISTORY_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Vouchershistory),
    inject: ['DATABASE_CONNECTION'],
  },
];
