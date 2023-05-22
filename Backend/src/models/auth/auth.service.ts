import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RolesRepository } from '../roles/roles.repository';
import axios from 'axios';
import { EmailService } from 'src/models/email/email.service';
import { sendEmailConfirmation } from '../../common/email/emails';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private roleRepository: RolesRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.getUserByEmail(email);
    // if (user && user.status !== 1)
    //   throw new HttpException(
    //     'No user found with given credentials.',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    if (
      user &&
      user.status === 1 &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      const token = this.jwtService.sign({
        id: user.id,
        role: { id: user.role?.id, name: user.role?.name },
      });
      await this.usersRepository.update(user.id, {
        ...user,
        lastLogIn: new Date().toISOString(),
      });
      sendEmailConfirmation(
        result.email,
        'User Signed In',
        'Someone is trying to log in to your account',
      );
      return { user: result, token };
    }
    throw new HttpException(
      'Email or Password is incorrect.',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async changeCredentials(body: any): Promise<any> {
    const user = await this.usersRepository.getUserByEmail(body.email);
    // if (user && user.status !== 1)
    //   throw new HttpException(
    //     'No user found with given credentials.',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    if (
      user &&
      user.status === 1 &&
      (await bcrypt.compare(body.password, user.password))
    ) {
      const update: any = {};
      if (body.updatePassword)
        update['password'] = await bcrypt.hash(body.updatePassword, 10);
      else if (body.updateEmail) update['email'] = body.updateEmail;
      const { password, email, ...result } = user;
      const token = this.jwtService.sign({
        id: user.id,
        role: { id: user.role?.id, name: user.role?.name },
      });
      await this.usersRepository.update(user.id, {
        ...user,
        lastLogIn: new Date().toISOString(),
        ...update,
      });
      let updateEmail;
      if (update.email) {
        updateEmail = update.email;
        return { user: { ...result, email: updateEmail }, token };
      }
      return { user: { ...result }, token };
    }
    throw new HttpException(
      'Email or Password is incorrect.',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async signInUserWithToken(userID: string): Promise<any> {
    const user = await this.usersRepository.getUserByID(userID);
    if (user) {
      const token = this.jwtService.sign({
        id: user.id,
        role: { id: user.role?.id, name: user.role?.name },
      });
      return { user, token };
    }
    throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
  }

  async signInUserWithGoogle(userToken: string): Promise<any> {
    try {
      const axiosResult = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${userToken}`,
      );
      const roleId = 'PU';
      const role = await this.roleRepository.lookUpRole(roleId);
      const user = {
        firstName: axiosResult.data.given_name,
        lastName: axiosResult.data.family_name,
        username: axiosResult.data.name,
        email: axiosResult.data.email,
        password: '',
        contact: '+00000-0000000',
        role,
        lastLogIn: '',
        reEnterPassword: '',
        referredBy: '',
        referralCode: uuidv4(),
      };
      const signedInUser = await this.usersRepository.signWithGoogle(user);

      const token = this.jwtService.sign({
        id: signedInUser.id,
        role: { id: signedInUser.role?.id, name: signedInUser.role?.name },
      });
      sendEmailConfirmation(
        signedInUser.email,
        'User Signed In',
        'Someone is trying to log in to your account',
      );
      return { user: signedInUser, token };
    } catch (error) {
      console.log(error);
      throw new HttpException('Invalid Google SignIn', HttpStatus.UNAUTHORIZED);
    }
  }

  async signUpUser(roleId: string, createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password !== createUserDto.reEnterPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.FORBIDDEN);
    }
    const user = await this.usersRepository.getUserByEmail(createUserDto.email);
    if (user) {
      throw new HttpException('Email Already Exists', 409);
    }
    const role = await this.roleRepository.lookUpRole(roleId);
    if (!role) throw new NotFoundException('No role with given ID exists.');
    createUserDto.role = role;
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersRepository.create(createUserDto);
    const { password, ...result } = newUser;
    const token = this.jwtService.sign({
      id: result.profile.id,
      role: { id: result.role?.id, name: result.role?.name },
    });

    // this.emailService.send(result.email);
    sendEmailConfirmation(
      result.email,
      'User created',
      'User account has been created',
    );
    return { user: result, token };
  }
}
