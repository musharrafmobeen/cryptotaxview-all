import { Connection } from 'typeorm';
import { Role } from './entities/role.entity';

export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Role),
    inject: ['DATABASE_CONNECTION'],
  },
];
