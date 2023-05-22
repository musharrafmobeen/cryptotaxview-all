import { Alliedaccounts } from './entities/alliedAccounts.entity';
import { Connection } from 'typeorm';

export const alliedAccountsProviders = [
  {
    provide: 'ALLIEDACCOUNTS_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Alliedaccounts),
    inject: ['DATABASE_CONNECTION'],
  },
];
