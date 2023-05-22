import { Test, TestingModule } from '@nestjs/testing';
import { MetamaskController } from './metamask.controller';
import { MetamaskService } from './metamask.service';

describe('MetamaskController', () => {
  let controller: MetamaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetamaskController],
      providers: [MetamaskService],
    }).compile();

    controller = module.get<MetamaskController>(MetamaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
