
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { UserplanService } from './userPlan.service';
import { UserplanRepository } from './userPlan.repository';
import { userPlanProviders } from './userPlan.providers';
import { UserplanController } from './userPlan.controller';

@Module({
  imports:[DatabaseModule],  
  controllers: [UserplanController],
  providers: [UserplanService, UserplanRepository, ...userPlanProviders],
  exports: [UserplanService, UserplanRepository, ...userPlanProviders]
})
export class UserplanModule {}
