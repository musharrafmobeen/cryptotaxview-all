import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { OrderHistoryExportController } from './order-history-export.controller';
import { orderHistoryExportProviders } from './order-history-export.provider';
import { OrderHistoryExportRepository } from './order-history-export.repository';
import { OrderHistoryExportService } from './order-history-export.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrderHistoryExportService,
    OrderHistoryExportRepository,
    ...orderHistoryExportProviders,
  ],
  controllers: [OrderHistoryExportController],
})
export class OrderHistoryExportModule {}
