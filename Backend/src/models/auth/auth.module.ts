import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { DatabaseModule } from 'src/config/database/database.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { EmailModule } from 'src/models/email/email.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    EmailModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
