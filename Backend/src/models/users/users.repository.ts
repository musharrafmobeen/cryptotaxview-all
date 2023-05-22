import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReferralsRepository } from '../referrals/referrals.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RolesService } from '../roles/roles.service';
@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
    @Inject('PROFILE_REPOSITORY')
    private profileRepository: Repository<Profile>,
    private readonly referralRepository: ReferralsRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.lastLogIn = new Date().toISOString();
    createUserDto.referralCode = uuidv4();

    const checkUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
    });

    if (checkUser.length > 0) {
      throw new HttpException('User Already Exists', 409);
    }

    const newUser = await this.usersRepository.save({
      ...createUserDto,
    });
    const profile = await this.profileRepository.save({
      ...createUserDto,
      user: newUser,
    });

    if (newUser.referredBy) {
      await this.referralRepository.updateReferral(newUser.email);
    }
    const { user, ...rest } = profile;
    const { password, ...restUser } = user;
    return { ...rest, profile: restUser };
  }

  async createUserCsv(createUserDto: CreateUserDto) {
    createUserDto.lastLogIn = new Date().toISOString();
    createUserDto.referralCode = uuidv4();

    const checkUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
    });

    if (checkUser.length > 0) {
      throw new Error('User Already Exists');
    }

    const newUser = await this.usersRepository.save({
      ...createUserDto,
    });
    const profile = await this.profileRepository.save({
      ...createUserDto,
      user: newUser,
    });
    const { user, ...rest } = profile;
    const { password, ...restUser } = user;
    return { ...rest, profile: restUser };
  }

  async signWithGoogle(createUserDto: CreateUserDto) {
    createUserDto.lastLogIn = new Date().toISOString();
    createUserDto.referralCode = uuidv4();
    const checkUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
    });

    if (checkUser.length > 0) {
      const checkUserProfile = await this.profileRepository.find({
        where: { user: checkUser[0].id },
      });

      const checkedUser = await this.usersRepository.save({
        ...checkUser[0],
        lastLogIn: new Date().toISOString(),
      });
      const userChecked = await this.usersRepository.findOne({
        where: { id: checkedUser.id },
        relations: ['role'],
      });

      const { user, ...rest } = checkUserProfile[0];
      const { password, ...restUser } = userChecked;
      return { ...restUser, profile: rest };
    }
    const newUser = await this.usersRepository.save({
      ...createUserDto,
    });
    const profile = await this.profileRepository.save({
      ...createUserDto,
      user: newUser,
    });
    const userChecked = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      relations: ['role'],
    });
    const { user, ...rest } = profile;
    const { password, ...restUser } = userChecked;
    return { ...restUser, profile: rest };
  }

  async findAll() {
    // return await this.usersRepository.find({
    //   where: { status: 1 },
    //   relations: ['profile', 'role'],
    // });
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.user = user.id')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.rolePermission', 'rolePermission')
      .leftJoinAndSelect('rolePermission.action', 'action')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .getMany();
  }

  async findOne(id: string) {
    // return await this.usersRepository.findOne({ id });
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.user = user.id')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('No user found with given ID.');
    if (user.status !== 1)
      throw new NotFoundException('No user found with given ID.');
    return user;
  }

  async findOneByEmail(email: string) {
    // return await this.usersRepository.findOne({ id });
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('No user found with given Email.');
    if (user.status !== 1)
      throw new NotFoundException('No user found with given Email.');
    return user;
  }

  async existsByEmail(email: string) {
    // return await this.usersRepository.findOne({ id });
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) return true;
    return false;
  }

  async getUserByEmail(email: string) {
    // return await this.usersRepository.findOne({ where: { email } });
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.user = user.id')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.rolePermission', 'rolePermission')
      .leftJoinAndSelect('rolePermission.action', 'action')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('user.email = :email', { email })
      .getOne();
  }

  async getUserByID(userID: string) {
    // return await this.usersRepository.findOne({ where: { email } });
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.user = user.id')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.rolePermission', 'rolePermission')
      .leftJoinAndSelect('rolePermission.action', 'action')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .where('user.id = :userID', { userID })
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.usersRepository.findOne({ id });
    if (!userToUpdate)
      throw new NotFoundException('No user found with given ID.');
    if (userToUpdate.status !== 1)
      throw new NotFoundException('No user found with given ID.');
    // throw new ConflictException(
    //   'Nothing to update.User may have already been deleted.',
    // );
    const { password, email, ...updatedFields } = updateUserDto;
    await this.usersRepository.save({
      ...userToUpdate,
      ...updateUserDto,
    });
    const savedUser = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile', 'profile.user = user.id')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
    const userProfile = await this.profileRepository.findOne({
      where: { user: id },
    });

    return { ...savedUser, profile: userProfile, user: savedUser };
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const profile = await this.profileRepository.findOne({ id });
    if (!profile)
      throw new NotFoundException('No profile found with the given ID.');
    if (profile.status !== 1)
      throw new NotFoundException('No user found with given ID.');
    const { username, ...updatedFields } = updateUserDto;
    return await this.profileRepository.save({
      ...profile,
      ...updatedFields,
    });
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ id });
    if (!user) throw new NotFoundException('No user found with given ID.');
    if (user.status !== 1)
      throw new ConflictException(
        'Nothing to delete.User may have already been deleted.',
      );
    return await this.usersRepository.save({ ...user, status: 0 });
  }
}
