import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { ActionsRepository } from './actions.repository';
import { actionsProviders } from './actions.providers';
import { DatabaseModule } from '../../config/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ActionsController],
  providers: [ActionsService, ActionsRepository, ...actionsProviders],
})
export class ActionsModule {}
