import { Connection } from 'typeorm';
import { ExchangePair } from './entities/exchange-pair.entity';

export const exchangePairProviders = [
  {
    provide: 'EXCHANGE_PAIR_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(ExchangePair),
    inject: ['DATABASE_CONNECTION'],
  },
];
