import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { Connection } from 'typeorm';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROFILE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Profile),
    inject: ['DATABASE_CONNECTION'],
  },
];
