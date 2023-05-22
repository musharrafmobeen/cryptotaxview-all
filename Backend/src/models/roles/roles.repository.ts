import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @Inject('ROLES_REPOSITORY')
    private rolesRepository: Repository<Role>,
  ) {}

  async lookUpRole(shortCode: string) {
    return await this.rolesRepository.findOne({ where: { shortCode } });
  }

  async lookUpRoleName(name: string) {
    return await this.rolesRepository.findOne({ name });
  }

  async lookUpRoleShortCode(shortCode: string) {
    return await this.rolesRepository.findOne({ shortCode });
  }

  async create(createRoleDto: CreateRoleDto) {
    const nameLookUp = await this.lookUpRoleName(createRoleDto.name);
    if (nameLookUp)
      throw new ConflictException('A role with name given already exists!');
    const shortCodeLookUp = await this.lookUpRoleShortCode(
      createRoleDto.shortCode,
    );
    if (shortCodeLookUp)
      throw new ConflictException(
        'A role with short-code given already exists!',
      );
    return await this.rolesRepository.save(createRoleDto);
  }

  async findAll() {
    return await this.rolesRepository.find({ relations: ['rolePermission'] });
  }

  async findOne(id: string) {
    const role = await this.lookUpRole(id);
    if (!role)
      throw new NotFoundException('No Role with given ID could be found.');
    // if (role.status !== 1)
    //   throw new NotFoundException(
    //     'No Role with given ID could be found. Nothing to show.',
    //   );
    return role;
  }

  async remove(id: string) {
    const role = await this.lookUpRole(id);
    if (!role)
      throw new NotFoundException('No Role with given ID could be found.');

    if (role.status !== 1)
      throw new NotFoundException(
        'No Role with given ID could be found. Nothing to delete.',
      );
    return await this.rolesRepository.save({
      ...role,
      status: 0,
    });
  }

  /*
  Below commented out code is for role update.
  ****************************************************
  As discussed with Musharraf and Saqib Javed name and 
  short code can only be unique so for the time being 
  code has been commented out but the logic to check 
  the uniqueness has been implemented below.
  ****************************************************
  */

  // async update(id: string, updateRoleDto: UpdateRoleDto) {
  //   const role = await this.lookUpRole(id);
  //   if (!role)
  //     throw new NotFoundException('No Role with given ID could be found.');

  //   if (role.status !== 1)
  //     throw new NotFoundException(
  //       'No Role with given ID could be found. Nothing to update.',
  //     );

  //   const nameLookUp = await this.lookUpRoleName(updateRoleDto.name);
  //   if (nameLookUp)
  //     throw new ConflictException('A role with name given already exists!');
  //   else {
  //     const shortCodeLookUp = await this.lookUpRoleShortCode(
  //       updateRoleDto.shortCode,
  //     );
  //     if (shortCodeLookUp)
  //       throw new ConflictException(
  //         'A role with short-code given already exists!',
  //       );
  //     else {
  //       return await this.rolesRepository.save({
  //         ...role,
  //         ...updateRoleDto,
  //       });
  //     }
  //   }
  // }
}
