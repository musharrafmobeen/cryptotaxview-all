import { Test, TestingModule } from '@nestjs/testing';
import { CsvConfigurationsController } from './csv-configurations.controller';
import { CsvConfigurationsService } from './csv-configurations.service';

describe('CsvConfigurationsController', () => {
  let controller: CsvConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvConfigurationsController],
      providers: [CsvConfigurationsService],
    }).compile();

    controller = module.get<CsvConfigurationsController>(CsvConfigurationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
