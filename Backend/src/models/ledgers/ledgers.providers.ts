
import { Ledgers } from './entities/ledgers.entity';
import { Connection } from 'typeorm';

export const ledgersProviders = [
  {
    provide: 'LEDGERS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Ledgers),
    inject: ['DATABASE_CONNECTION'],
  },
];
