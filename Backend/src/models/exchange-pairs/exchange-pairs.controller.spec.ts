import { Test, TestingModule } from '@nestjs/testing';
import { ExchangePairsController } from './exchange-pairs.controller';
import { ExchangePairsService } from './exchange-pairs.service';

describe('ExchangePairsController', () => {
  let controller: ExchangePairsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangePairsController],
      providers: [ExchangePairsService],
    }).compile();

    controller = module.get<ExchangePairsController>(ExchangePairsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
