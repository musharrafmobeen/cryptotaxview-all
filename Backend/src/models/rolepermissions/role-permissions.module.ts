import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsController } from './role-permissions.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { rolesPermissionsProviders } from './roles-permissions.providers';
import { RolesPermissionsRepository } from './roles-permissions.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { ActionsRepository } from '../actions/actions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { permissionProviders } from '../permissions/permissions.providers';
import { actionsProviders } from '../actions/actions.providers';
import { rolesProviders } from '../roles/roles.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RolePermissionsController],
  providers: [
    RolePermissionsService,
    RolesPermissionsRepository,
    PermissionsRepository,
    ActionsRepository,
    RolesRepository,
    ...rolesPermissionsProviders,
    ...permissionProviders,
    ...actionsProviders,
    ...rolesProviders,
  ],
})
export class RolePermissionsModule {}
