import { Test, TestingModule } from '@nestjs/testing';
import { ExchangePairsService } from './exchange-pairs.service';

describe('ExchangePairsService', () => {
  let service: ExchangePairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangePairsService],
    }).compile();

    service = module.get<ExchangePairsService>(ExchangePairsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
