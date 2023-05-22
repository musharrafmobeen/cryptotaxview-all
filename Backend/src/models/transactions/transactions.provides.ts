import { Transaction } from './entities/transaction.entity';
import { Connection } from 'typeorm';
import { OriginalTransaction } from './entities/transaction-original.entity';

export const transactionProviders = [
  {
    provide: 'TRANSACTION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Transaction),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ORIGINAL_TRANSACTION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(OriginalTransaction),
    inject: ['DATABASE_CONNECTION'],
  },
];
