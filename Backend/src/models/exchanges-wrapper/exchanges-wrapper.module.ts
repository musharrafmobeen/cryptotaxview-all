import { Module } from '@nestjs/common';
import { ExchangesWrapperService } from './exchanges-wrapper.service';
import { ExchangesWrapperController } from './exchanges-wrapper.controller';
import { BinanceRepository } from './binance.repository';
import { DatabaseModule } from 'src/config/database/database.module';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';
import { CoinbaseRepository } from './coinbase.repository';
import { CoinspotRepository } from './coinspot.repository';
import { SwyftxRepository } from './swyftx.repository';
import { orderHistoryImportProviders } from '../order-history-import/order-history-import.provider';
import { OrderHistoryImportModule } from '../order-history-import/order-history-import.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { UserFilesModule } from '../user-files/user-files.module';
import { MetamaskRepository } from './metamask.repository';
import { BitcoinRepository } from './bitcoin.reprository';
import { AllExchangesRepository } from './allExchanges.respository';
import { DigitalSurgeRepository } from './digital-surge.repository';
import { UserplanModule } from '../userPlan/userPlan.module';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';
import { AlliedaccountsModule } from '../alliedAccounts/alliedAccounts.module';
import { VouchershistoryModule } from '../vouchersHistory/vouchersHistory.module';
import { LedgersModule } from '../ledgers/ledgers.module';

@Module({
  imports: [
    VouchershistoryModule,
    DatabaseModule,
    ExchangePairsModule,
    OrderHistoryImportModule,
    TransactionsModule,
    UsersModule,
    UserFilesModule,
    UserplanModule,
    AlliedaccountsModule,
    LedgersModule,
  ],
  controllers: [ExchangesWrapperController],
  providers: [
    ...orderHistoryImportProviders,
    ExchangesWrapperService,
    BinanceRepository,
    BinanceRepository,
    CoinbaseRepository,
    CoinspotRepository,
    SwyftxRepository,
    MetamaskRepository,
    BitcoinRepository,
    AllExchangesRepository,
    DigitalSurgeRepository,
    TaxCalculationService,
  ],
  exports: [
    ...orderHistoryImportProviders,
    ExchangesWrapperService,
    BinanceRepository,
    BinanceRepository,
    CoinbaseRepository,
    CoinspotRepository,
    SwyftxRepository,
    MetamaskRepository,
    BitcoinRepository,
    DigitalSurgeRepository,
    AllExchangesRepository,
    TaxCalculationService,
  ],
})
export class ExchangesWrapperModule {}
