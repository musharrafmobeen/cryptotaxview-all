
import { Userpaymentamounts } from './entities/userPaymentAmounts.entity';
import { Connection } from 'typeorm';

export const userPaymentAmountsProviders = [
  {
    provide: 'USERPAYMENTAMOUNTS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Userpaymentamounts),
    inject: ['DATABASE_CONNECTION'],
  },
];
