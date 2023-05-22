import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { VouchershistoryService } from './vouchersHistory.service';
import { VouchershistoryRepository } from './vouchersHistory.repository';
import { vouchersHistoryProviders } from './vouchersHistory.providers';
import { VouchershistoryController } from './vouchersHistory.controller';
import { UserplanModule } from '../userPlan/userPlan.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UserplanModule, UsersModule],
  controllers: [VouchershistoryController],
  providers: [
    VouchershistoryService,
    VouchershistoryRepository,
    ...vouchersHistoryProviders,
  ],
  exports: [
    VouchershistoryService,
    VouchershistoryRepository,
    ...vouchersHistoryProviders,
  ],
})
export class VouchershistoryModule {}
