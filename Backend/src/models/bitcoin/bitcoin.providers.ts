import { Connection } from 'typeorm';
import { Bitcoin } from './entities/bitcoin.entity';

export const bitcoinProviders = [
  {
    provide: 'BITCOIN_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Bitcoin),
    inject: ['DATABASE_CONNECTION'],
  },
];
