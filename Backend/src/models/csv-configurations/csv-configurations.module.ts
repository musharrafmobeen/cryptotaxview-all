import { Module } from '@nestjs/common';
import { CsvConfigurationsService } from './csv-configurations.service';
import { CsvConfigurationsController } from './csv-configurations.controller';

@Module({
  controllers: [CsvConfigurationsController],
  providers: [CsvConfigurationsService]
})
export class CsvConfigurationsModule {}
