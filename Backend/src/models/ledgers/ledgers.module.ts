
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { LedgersService } from './ledgers.service';
import { LedgersRepository } from './ledgers.repository';
import { ledgersProviders } from './ledgers.providers';
import { LedgersController } from './ledgers.controller';

@Module({
  imports:[DatabaseModule],  
  controllers: [LedgersController],
  providers: [LedgersService, LedgersRepository, ...ledgersProviders],
  exports: [LedgersService, LedgersRepository, ...ledgersProviders]
})
export class LedgersModule {}
