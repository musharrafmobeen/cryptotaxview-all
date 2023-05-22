import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsRepository {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionsRepository: Repository<Permission>,
  ) {}

  async lookupPermission(id: string) {
    return await this.permissionsRepository.findOne({ id });
  }

  async lookUpPermName(name: string) {
    return await this.permissionsRepository.findOne({ name });
  }

  async lookUpPermShortCode(shortCode: string) {
    return await this.permissionsRepository.findOne({ shortCode });
  }

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionsRepository.save({ ...createPermissionDto });
  }

  findAll() {
    return this.permissionsRepository.find();
  }

  async findOne(id: string) {
    const permission = await this.lookupPermission(id);
    if (!permission)
      throw new NotFoundException('No permission with given ID exists.');
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.lookupPermission(id);
    if (!permission)
      throw new NotFoundException('No permission with given ID exists.');
    const nameLookUp = await this.lookUpPermName(updatePermissionDto.name);
    if (nameLookUp)
      return new ConflictException(
        'A permission with given name already exists.',
      );
    const shortCodeLookUp = await this.lookUpPermShortCode(
      updatePermissionDto.shortCode,
    );
    if (shortCodeLookUp)
      return new ConflictException(
        'A permission with given short-code already exists.',
      );
    return await this.permissionsRepository.save({
      ...permission,
      ...updatePermissionDto,
    });
  }

  async remove(id: string) {
    const permission = await this.lookupPermission(id);
    if (!permission)
      throw new NotFoundException('No permission with given ID exists.');
    return await this.permissionsRepository.delete(id);
  }
}
