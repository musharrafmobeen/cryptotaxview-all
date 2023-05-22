import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Console } from 'console';
import {
  createUserSchema,
  loginSchema,
} from '../../common/contants/joi-validation-schemas';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  authenticateUser(
    @Body(new JoiValidationPipe(loginSchema))
    user: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.validateUser(user.email, user.password);
  }

  @Patch('update_credentials')
  changeCredentials(
    @Body()
    body: any,
  ) {
    return this.authService.changeCredentials(body);
  }

  @Get('token/refresh')
  signInWithToken(
    @Body('userID')
    userID: string,
  ) {
    return this.authService.signInUserWithToken(userID);
  }

  @Post('signin/google')
  signInWithGoogle(
    @Body('userToken')
    userToken: string,
  ) {
    return this.authService.signInUserWithGoogle(userToken);
  }

  @Post('signup')
  signupUser(
    @Body(new JoiValidationPipe(createUserSchema)) user: CreateUserDto,
    @Body('role') roleId: string,
  ) {
    return this.authService.signUpUser(roleId, user);
  }
}
