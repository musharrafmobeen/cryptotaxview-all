import { Test, TestingModule } from '@nestjs/testing';
import { UserFilesController } from './user-files.controller';
import { UserFilesService } from './user-files.service';

describe('UserFilesController', () => {
  let controller: UserFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFilesController],
      providers: [UserFilesService],
    }).compile();

    controller = module.get<UserFilesController>(UserFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
