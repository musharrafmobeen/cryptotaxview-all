import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Action } from '../actions/entities/action.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class RolesPermissionsRepository {
  constructor(
    @Inject('ROLESPERMISSIONS_REPOSITORY')
    private rolesPermissionsRepository: Repository<RolePermission>,
  ) {}

  async lookUpRlePermission(id: string) {
    return await this.rolesPermissionsRepository.findOne({ id });
  }

  async lookUpRolePermShortName(shortName: string) {
    return await this.rolesPermissionsRepository.findOne({ shortName });
  }

  async lookUpRolePermShortCode(shortCode: string) {
    return await this.rolesPermissionsRepository.findOne({ shortCode });
  }

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    const shortNameLookUp = await this.lookUpRolePermShortName(
      createRolePermissionDto.shortName,
    );
    if (shortNameLookUp)
      throw new ConflictException(
        'A role permission with given short-name already exists.',
      );
    const shortCodeLookUp = await this.lookUpRolePermShortCode(
      createRolePermissionDto.shortCode,
    );
    if (shortCodeLookUp)
      throw new ConflictException(
        'A role permission with given short-code already exists.',
      );
    return await this.rolesPermissionsRepository.save({
      ...createRolePermissionDto,
    });
  }

  async findAll() {
    // return await this.rolesPermissionsRepository.find({ status: 1 });
    return await this.rolesPermissionsRepository
      .createQueryBuilder('rolesPermission')
      .select([
        'rolesPermission.id',
        'rolesPermission.shortName',
        'rolesPermission.shortCode',
        'rolesPermission.status',
        'permission.id',
        'action.id',
        'role.id',
      ])
      .leftJoin('rolesPermission.action', 'action')
      .leftJoin('rolesPermission.permission', 'permission')
      .leftJoin('rolesPermission.role', 'role')
      .where('rolesPermission.status = 1')
      .getMany();
  }

  async findOne(id: string) {
    const rolePermission = await this.lookUpRlePermission(id);
    if (!rolePermission)
      throw new NotFoundException(
        'No role permission with given ID could be found.',
      );
    if (rolePermission.status !== 1)
      throw new NotFoundException(
        'No role permission with given ID could be found. Nothing to show',
      );
    return rolePermission;
  }

  async update(id: string, updateRolePermissionDto: UpdateRolePermissionDto) {
    const rolePermission = await this.lookUpRlePermission(id);
    if (!rolePermission)
      throw new NotFoundException(
        'No role permission with given ID could be found.',
      );
    if (rolePermission.status !== 1)
      throw new NotFoundException(
        'No role permission with given ID could be found. Nothing to update',
      );
    const shortNameLookUp = await this.lookUpRolePermShortName(
      updateRolePermissionDto.shortName,
    );
    if (shortNameLookUp)
      throw new ConflictException(
        'A role permission with given short-name already exists.',
      );
    const shortCodeLookUp = await this.lookUpRolePermShortCode(
      updateRolePermissionDto.shortCode,
    );
    if (shortCodeLookUp)
      throw new ConflictException(
        'A role permission with given short-code already exists.',
      );
    return await this.rolesPermissionsRepository.save({
      ...rolePermission,
      ...updateRolePermissionDto,
    });
  }

  async remove(id: string) {
    const rolePermission = await this.lookUpRlePermission(id);
    if (!rolePermission)
      throw new NotFoundException(
        'No role permission with given ID could be found.',
      );
    if (rolePermission.status !== 1)
      throw new NotFoundException(
        'No role permission with given ID could be found. Nothing to delete',
      );
    return this.rolesPermissionsRepository.save({
      ...rolePermission,
      status: 0,
    });
  }
}
