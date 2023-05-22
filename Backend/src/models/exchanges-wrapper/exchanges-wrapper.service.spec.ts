import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesWrapperService } from './exchanges-wrapper.service';

describe('ExchangesWrapperService', () => {
  let service: ExchangesWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangesWrapperService],
    }).compile();

    service = module.get<ExchangesWrapperService>(ExchangesWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
