import { Test, TestingModule } from '@nestjs/testing';
import { CsvConfigurationsService } from './csv-configurations.service';

describe('CsvConfigurationsService', () => {
  let service: CsvConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvConfigurationsService],
    }).compile();

    service = module.get<CsvConfigurationsService>(CsvConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
