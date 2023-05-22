
import { Userplan } from './entities/userPlan.entity';
import { Connection } from 'typeorm';

export const userPlanProviders = [
  {
    provide: 'USERPLAN_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Userplan),
    inject: ['DATABASE_CONNECTION'],
  },
];
