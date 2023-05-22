import { Connection } from 'typeorm';
import { Referral } from './entities/referral.entity';

export const referralProviders = [
  {
    provide: 'REFERRAL_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Referral),
    inject: ['DATABASE_CONNECTION'],
  },
];
