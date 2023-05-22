import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { RolesRepository } from '../roles.repository';
import { mockRolesRepository } from './mocks/roles.repository.mock';
describe('Roles', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService, RolesRepository],
    })
      .overrideProvider(RolesRepository)
      .useValue(mockRolesRepository)
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an roles call to the repository', () => {
    const createRoleObject = {
      name: 'test2Name',
      shortCode: 'test2ShortCode',
      status: '2',
    };
    expect(controller.create(createRoleObject)).toEqual({
      ...createRoleObject,
      id: expect.any(String),
    });
    expect(controller.create);
  });

  it('should view all roles', () => {
    expect(controller.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          shortCode: expect.any(String),
          status: expect.any(String),
        }),
      ]),
    );
    expect(controller.findAll);
  });

  it('should view specific role by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      shortCode: expect.any(String),
      status: expect.any(String),
    });
    expect(controller.findOne);
  });
});
