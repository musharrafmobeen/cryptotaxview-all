import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { DatabaseModule } from '../../config/database/database.module';
import { RolesModule } from '../roles/roles.module';
import { ReferralsModule } from '../referrals/referrals.module';

@Module({
  imports: [DatabaseModule, RolesModule, ReferralsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, ...userProviders],
  exports: [UsersService, UsersRepository, ...userProviders],
})
export class UsersModule {}
