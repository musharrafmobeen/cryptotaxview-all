import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';

describe('ActionsService', () => {
  let service: ActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsService],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('actions find one', () => {
    expect(
      service.findOne('3a02955c-c573-4f5e-a1f6-b7ce55c7f93e'),
    ).toBeInstanceOf(CreateActionDto);
  });
});
