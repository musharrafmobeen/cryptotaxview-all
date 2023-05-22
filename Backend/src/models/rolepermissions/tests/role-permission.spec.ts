import { Body } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionsController } from '../role-permissions.controller';
import { RolePermissionsService } from '../role-permissions.service';
import { RolesPermissionsRepository } from '../roles-permissions.repository';
import { mockRolePermissionRepository } from './mocks/role-permission.repository.mock';
import { mockRolePermissionService } from './mocks/role-permission.service.mock';
describe('Role-Permission', () => {
  let controller: RolePermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionsController],
      providers: [RolePermissionsService],
    })
      .overrideProvider(RolePermissionsService)
      .useValue(mockRolePermissionService)
      .compile();

    controller = module.get<RolePermissionsController>(
      RolePermissionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an permission call to the repository', () => {
    const createRolePermissionObject = {
      shortName: 'testName',
      shortCode: 'testShortCode',
      role: null,
      action: null,
      permission: null,
    };
    expect(
      controller.create(createRolePermissionObject, '4', '4', '3'),
    ).toEqual({
      ...createRolePermissionObject,
      id: expect.any(String),
    });
  });

  it('should view all role permissions', () => {
    expect(controller.findAll()).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          shortName: expect.any(String),
          shortCode: expect.any(String),
          status: expect.any(String),
          roleId: expect.any(String),
          actionId: expect.any(String),
          permissionId: expect.any(String),
        }),
      ]),
    );
  });

  it('should view specific role permission by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(String),
      shortName: expect.any(String),
      shortCode: expect.any(String),
      status: expect.any(String),
      roleId: expect.any(String),
      actionId: expect.any(String),
      permissionId: expect.any(String),
    });
    expect(controller.findOne);
  });

  it('should patch role permission by id', () => {
    const createRolePermissionObject = {
      shortName: 'testName',
      shortCode: 'testShortCode',
    };
    expect(controller.update('1', createRolePermissionObject)).toMatchObject({
      ...createRolePermissionObject,
      id: expect.any(String),
    });
    expect(controller.findOne);
  });

  it('should return error on patch role permission by unknown id', () => {
    const createRolePermissionObject = {
      shortName: 'testName',
      shortCode: 'testShortCode',
    };
    expect(controller.update('4', createRolePermissionObject)).toMatchObject({
      statusCode: 404,
      message: 'No role permission with given ID could be found.',
      error: 'Not Found',
    });
    expect(controller.findOne);
  });

  it('should delete role permission by id', () => {
    const createRolePermissionObject = {
      id: '1',
      shortName: 'testName',
      shortCode: 'testShortCode',
      status: '1',
    };
    expect(controller.remove('1')).toMatchObject(createRolePermissionObject);
  });
  it('should not delete role permission by unknown id', () => {
    expect(controller.remove('4')).toMatchObject({
      statusCode: 404,
      message: 'No role permission with given ID could be found.',
      error: 'Not Found',
    });
  });
});
