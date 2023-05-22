import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { AlliedaccountsService } from './alliedAccounts.service';
import { AlliedaccountsRepository } from './alliedAccounts.repository';
import { alliedAccountsProviders } from './alliedAccounts.providers';
import { AlliedaccountsController } from './alliedAccounts.controller';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ExchangePairsModule)],
  controllers: [AlliedaccountsController],
  providers: [
    AlliedaccountsService,
    AlliedaccountsRepository,
    ...alliedAccountsProviders,
  ],
  exports: [
    AlliedaccountsService,
    AlliedaccountsRepository,
    ...alliedAccountsProviders,
  ],
})
export class AlliedaccountsModule {}
