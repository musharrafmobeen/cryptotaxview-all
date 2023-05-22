import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionsRepository) {}
  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.findAll();
  }

  findOne(id: string) {
    return this.permissionRepository.findOne(id);
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  remove(id: string) {
    return this.remove(id);
  }

  lookUpPermission(permissionId: string) {
    return this.lookUpPermission(permissionId);
  }
}
