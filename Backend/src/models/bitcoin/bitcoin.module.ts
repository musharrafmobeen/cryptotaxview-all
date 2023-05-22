import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { BitcoinRepository } from './bitcoin.repository';
import { bitcoinProviders } from './bitcoin.providers';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';

@Module({
  imports: [DatabaseModule, ExchangePairsModule],
  controllers: [BitcoinController],
  providers: [BitcoinService, BitcoinRepository, ...bitcoinProviders],
  exports: [BitcoinService, BitcoinRepository, ...bitcoinProviders],
})
export class BitcoinModule {}
