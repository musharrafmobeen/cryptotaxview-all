import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { OrderHistoryImportController } from './order-history-import.controller';
import { orderHistoryImportProviders } from './order-history-import.provider';
import { OrderHistoryImportRepository } from './order-history-import.repository';
import { OrderHistoryImportService } from './order-history-import.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserFilesModule } from '../user-files/user-files.module';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';
import { ExchangesWrapperModule } from '../exchanges-wrapper/exchanges-wrapper.module';

@Module({
  imports: [
    DatabaseModule,
    TransactionsModule,
    UserFilesModule,
    ExchangePairsModule,
    forwardRef(() => ExchangesWrapperModule),
  ],
  providers: [
    OrderHistoryImportService,
    OrderHistoryImportRepository,
    ...orderHistoryImportProviders,
  ],
  controllers: [OrderHistoryImportController],
  exports: [
    OrderHistoryImportService,
    OrderHistoryImportRepository,
    ...orderHistoryImportProviders,
  ],
})
export class OrderHistoryImportModule {}
