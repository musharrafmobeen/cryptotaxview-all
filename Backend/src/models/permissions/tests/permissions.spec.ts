import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from '../permissions.controller';
import { PermissionsService } from '../permissions.service';
import { PermissionsRepository } from '../permissions.repository';
import { mockPermissionRepository } from './mocks/permission.repository.mock';
describe('Permission', () => {
  let controller: PermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [PermissionsService, PermissionsRepository],
    })
      .overrideProvider(PermissionsRepository)
      .useValue(mockPermissionRepository)
      .compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an permission call to the repository', () => {
    const createPermissionObject = {
      name: 'test1Name',
      shortCode: 'test1ShortCode',
      level: 1,
    };
    expect(controller.create(createPermissionObject)).toEqual({
      ...createPermissionObject,
      id: expect.any(String),
    });
    expect(controller.create);
  });

  it('should view all permission', () => {
    expect(controller.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          shortCode: expect.any(String),
          level: expect.any(Number),
        }),
      ]),
    );
    expect(controller.findAll);
  });

  it('should view specific permission by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      shortCode: expect.any(String),
      level: expect.any(Number),
    });
    expect(controller.findOne);
  });
});
