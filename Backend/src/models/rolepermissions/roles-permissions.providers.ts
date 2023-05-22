import { Connection } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';

export const rolesPermissionsProviders = [
  {
    provide: 'ROLESPERMISSIONS_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(RolePermission),
    inject: ['DATABASE_CONNECTION'],
  },
];
