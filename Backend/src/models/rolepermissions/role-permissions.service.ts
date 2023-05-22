import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionsRepository } from '../actions/actions.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolesPermissionsRepository } from './roles-permissions.repository';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionRepository: PermissionsRepository,
    private readonly actionsRepository: ActionsRepository,
    private readonly rolesPermissionsRepository: RolesPermissionsRepository,
  ) {}

  async create(
    createRolePermissionDto: CreateRolePermissionDto,
    roleId: string,
    actionId: string,
    permissionId: string,
  ) {
    const role = await this.rolesRepository.lookUpRole(roleId);
    if (!role) throw new NotFoundException('No role with given ID exists.');
    createRolePermissionDto.role = role;
    const permission = await this.permissionRepository.lookupPermission(
      permissionId,
    );
    if (!permission)
      throw new NotFoundException('No permission with given ID exists.');
    createRolePermissionDto.permission = permission;
    const action = await this.actionsRepository.lookUpAction(actionId);
    if (!action) throw new NotFoundException('No action with given ID exists.');
    createRolePermissionDto.action = action;
    return this.rolesPermissionsRepository.create(createRolePermissionDto);
  }

  findAll() {
    return this.rolesPermissionsRepository.findAll();
  }

  findOne(id: string) {
    return this.rolesPermissionsRepository.findOne(id);
  }

  update(id: string, updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.rolesPermissionsRepository.update(id, updateRolePermissionDto);
  }

  remove(id: string) {
    return this.rolesPermissionsRepository.remove(id);
  }
}
