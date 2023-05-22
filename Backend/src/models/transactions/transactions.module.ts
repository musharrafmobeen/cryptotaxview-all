import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { transactionProviders } from './transactions.provides';
import { TransactionsRepository } from './transactions.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { OrderHistoryImportModule } from '../order-history-import/order-history-import.module';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';
import { AlliedaccountsModule } from '../alliedAccounts/alliedAccounts.module';
import { ExchangesWrapperModule } from '../exchanges-wrapper/exchanges-wrapper.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ExchangePairsModule),
    forwardRef(() => ExchangesWrapperModule),
    AlliedaccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    ...transactionProviders,
  ],
  exports: [
    TransactionsService,
    TransactionsRepository,
    ...transactionProviders,
  ],
})
export class TransactionsModule {}
