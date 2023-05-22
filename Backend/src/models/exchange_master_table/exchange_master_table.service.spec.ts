import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeMasterTableService } from './exchange_master_table.service';

describe('ExchangeMasterTableService', () => {
  let service: ExchangeMasterTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeMasterTableService],
    }).compile();

    service = module.get<ExchangeMasterTableService>(ExchangeMasterTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
