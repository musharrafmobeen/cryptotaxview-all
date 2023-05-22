import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesWrapperController } from './exchanges-wrapper.controller';
import { ExchangesWrapperService } from './exchanges-wrapper.service';

describe('ExchangesWrapperController', () => {
  let controller: ExchangesWrapperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangesWrapperController],
      providers: [ExchangesWrapperService],
    }).compile();

    controller = module.get<ExchangesWrapperController>(ExchangesWrapperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
