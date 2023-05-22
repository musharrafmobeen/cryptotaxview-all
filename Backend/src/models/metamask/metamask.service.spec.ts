import { Test, TestingModule } from '@nestjs/testing';
import { MetamaskService } from './metamask.service';

describe('MetamaskService', () => {
  let service: MetamaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetamaskService],
    }).compile();

    service = module.get<MetamaskService>(MetamaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
