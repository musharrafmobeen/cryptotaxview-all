import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFile } from 'fs';
import { promisify } from 'util';
import { RolesRepository } from '../roles/roles.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { emailVerification } from 'src/common/email/emails';
import { ReferralsRepository } from '../referrals/referrals.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roleRepository: RolesRepository,
    private readonly referralRepository: ReferralsRepository,
  ) {}

  async create(roleShortCode: string, createUserDto: CreateUserDto) {
    const role = await this.roleRepository.lookUpRole(roleShortCode);
    if (!role) throw new NotFoundException('No role with given ID exists.');
    createUserDto.role = role;
    return await this.usersRepository.create(createUserDto);
  }

  async usersEmailInvitations(file: Express.Multer.File, userID: string) {
    if (!file)
      throw new BadRequestException(
        'File Data Validation Failed. Cannot Upload file.',
      );
    const user = await this.usersRepository.findOne(userID);

    const default_headers = {
      firstName: 0,
      lastName: 1,
      email: 2,
      password: 3,
      sendEmail: 4,
    };

    const reader = promisify(readFile);

    const data = (await reader(file.path)).toString();
    const splitData = data.split('\n');

    const headers = splitData[0].split(',');
    let count = 0;

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].replace('\r', '');
      if (default_headers[header] || default_headers[header] === 0) {
        default_headers[header] = i;
        count++;
      }
    }

    if (count !== 4) {
      throw new HttpException(
        'All Columns Not Present',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    // const existingUsers = [];
    for (let i = 1; i < splitData.length; i++) {
      if (splitData[i] !== '') {
        const userData = splitData[i].split(',');
        try {
          const firstName = userData[default_headers['firstName']].replace(
            '\r',
            '',
          );
          const lastName = userData[default_headers['lastName']].replace(
            '\r',
            '',
          );
          const email = userData[default_headers['email']].replace('\r', '');
          const sendEmail = userData[default_headers['sendEmail']].replace(
            '\r',
            '',
          );
          let client: any;
          const role = await this.roleRepository.lookUpRole('CU');
          if (!role)
            throw new NotFoundException('No role with given ID exists.');
          if (sendEmail.toLowerCase() === 'no') {
            client = await this.usersRepository.create({
              email,
              role,
              firstName,
              lastName,
              username: firstName,
              password: '',
              contact: '+00000-0000000',
              lastLogIn: '',
              reEnterPassword: '',
              referredBy: userID,
              referralCode: uuidv4(),
            });
          } else {
            client = await this.usersRepository.create({
              email,
              role,
              firstName,
              lastName,
              username: firstName,
              password: '',
              contact: '+00000-0000000',
              lastLogIn: '',
              reEnterPassword: '',
              referredBy: userID,
              referralCode: uuidv4(),
            });
            emailVerification(
              firstName,
              lastName,
              email,
              user.referralCode,
              client.id,
              user.profile.firstName,
              user.email,
            );
          }
          await this.referralRepository.create({
            referrersID: user.referralCode,
            email: email,
            firstName: firstName,
            lastName: lastName,
            exchanges: [],
            status: sendEmail.toLowerCase() === 'no' ? 1 : 2,
            managedBy: user.profile.firstName + ' ' + user.profile.lastName,
          });
        } catch (e) {}
      }
    }

    return { message: 'Invitations Sent' };
  }

  async singleUserEmailInvitation(userToBeInvited: string, userID: string) {
    const referringUser = await this.usersRepository.findOne(userID);
    const user = await this.usersRepository.findOneByEmail(userToBeInvited);
    const client =
      await this.referralRepository.findAllByReferralCodeAndUserEmail(
        referringUser.referralCode,
        user.email,
      );
    if (client) {
      let client: any;
      const firstName = user.profile.firstName;
      const lastName = user.profile.lastName;
      const email = user.email;
      const role = await this.roleRepository.lookUpRole('CU');
      if (!role) throw new NotFoundException('No role with given ID exists.');
      emailVerification(
        firstName,
        lastName,
        email,
        referringUser.referralCode,
        user.id,
        referringUser.profile.firstName,
        referringUser.email,
      );

      await this.referralRepository.updateReferralEmailSent(user.email);

      return { message: 'Invitation Sent' };
    }
    throw new HttpException('User is not a client', HttpStatus.UNAUTHORIZED);
  }

  async userEmailInvitation(users: any, userID: string) {
    const referringUser = await this.usersRepository.findOne(userID);
    for (let i = 0; i < users.length; i++) {
      let client: any;
      if (!(await this.usersRepository.existsByEmail(users[i].email))) {
        const { firstName, lastName, email, sendEmail } = users[i];
        const role = await this.roleRepository.lookUpRole('CU');
        if (!role) throw new NotFoundException('No role with given ID exists.');
        if (sendEmail.toLowerCase() === 'no') {
          client = await this.usersRepository.create({
            email,
            role,
            firstName,
            lastName,
            username: firstName,
            password: '',
            contact: '+00000-0000000',
            lastLogIn: '',
            reEnterPassword: '',
            referredBy: referringUser.referralCode,
            referralCode: uuidv4(),
          });
        } else {
          client = await this.usersRepository.create({
            email,
            role,
            firstName,
            lastName,
            username: firstName,
            password: '',
            contact: '+00000-0000000',
            lastLogIn: '',
            reEnterPassword: '',
            referredBy: referringUser.referralCode,
            referralCode: uuidv4(),
          });
          emailVerification(
            firstName,
            lastName,
            email,
            referringUser.referralCode,
            client.profile.id,
            referringUser.profile.firstName,
            referringUser.email,
          );
        }
        await this.referralRepository.create({
          referrersID: referringUser.referralCode,
          email: email,
          firstName: firstName,
          lastName: lastName,
          exchanges: [],
          status: sendEmail.toLowerCase() === 'no' ? 1 : 2,
          managedBy:
            referringUser.profile.firstName +
            ' ' +
            referringUser.profile.lastName,
        });
      }
    }

    return { message: 'Invitation Sent' };
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      return this.usersRepository.update(id, updateUserDto);
    } else {
      return this.usersRepository.update(id, updateUserDto);
    }
  }

  updateProfile(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateProfile(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
