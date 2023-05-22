import { forwardRef, Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { ReferralsRepository } from './referrals.repository';
import { referralProviders } from './referrals.providers';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  controllers: [ReferralsController],
  providers: [ReferralsService, ReferralsRepository, ...referralProviders],
  exports: [ReferralsService, ReferralsRepository, ...referralProviders],
})
export class ReferralsModule {}
