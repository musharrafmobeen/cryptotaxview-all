import { Action } from './entities/action.entity';
import { Connection } from 'typeorm';

export const actionsProviders = [
  {
    provide: 'ACTION_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Action),
    inject: ['DATABASE_CONNECTION'],
  },
];
