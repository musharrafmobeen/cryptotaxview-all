// import { Inject, Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { CreateRoleDto } from './dto/create-role.dto';
// @Injectable()
// export class UsersRepository {
//   constructor(
//     @Inject('USER_REPOSITORY')
//     private usersRepository: Repository<User>,
//     @Inject('PROFILE_REPOSITORY')
//     private profileRepository: Repository<Profile>,
//   ) {}
//   create(createRoleDto: CreateRoleDto) {
//     return 'This action adds a new role';
//   }
//   findAll() {
//     return `This action returns all roles`;
//   }
//   findOne(id: number) {
//     return `This action returns a #${id} role`;
//   }
//   update(id: number, updateRoleDto: UpdateRoleDto) {
//     return `This action updates a #${id} role`;
//   }
//   remove(id: number) {
//     return `This action removes a #${id} role`;
//   }
// }
