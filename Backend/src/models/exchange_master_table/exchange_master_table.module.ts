import { Module } from '@nestjs/common';
import { ExchangeMasterTableService } from './exchange_master_table.service';
import { ExchangeMasterTableController } from './exchange_master_table.controller';
import { ExchangeMasterTableRepository } from './exchange_master_table.repository';
import { exchangeMasterTableProviders } from './exchange_master_table.providers';
import { DatabaseModule } from 'src/config/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExchangeMasterTableController],
  providers: [
    ExchangeMasterTableService,
    ExchangeMasterTableRepository,
    ...exchangeMasterTableProviders,
  ],
})
export class ExchangeMasterTableModule {}
