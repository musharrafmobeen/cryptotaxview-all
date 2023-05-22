import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}
  create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  findAll() {
    return this.rolesRepository.findAll();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne(id);
  }

  /*
 As discussed with Musharraf and Saqib Javed for the time being code to 
 update has been commented out.
*/

  // update(id: string, updateRoleDto: UpdateRoleDto) {
  //   return this.rolesRepository.update(id, updateRoleDto);
  // }

  remove(id: string) {
    return this.rolesRepository.remove(id);
  }

  lookupRole(id: string) {
    return this.rolesRepository.lookUpRole(id);
  }
}
