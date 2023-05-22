import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeMasterTableController } from './exchange_master_table.controller';
import { ExchangeMasterTableService } from './exchange_master_table.service';

describe('ExchangeMasterTableController', () => {
  let controller: ExchangeMasterTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeMasterTableController],
      providers: [ExchangeMasterTableService],
    }).compile();

    controller = module.get<ExchangeMasterTableController>(ExchangeMasterTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
