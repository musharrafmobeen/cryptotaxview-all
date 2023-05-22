import { Test, TestingModule } from '@nestjs/testing';
import { UserFilesService } from './user-files.service';

describe('UserFilesService', () => {
  let service: UserFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFilesService],
    }).compile();

    service = module.get<UserFilesService>(UserFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
