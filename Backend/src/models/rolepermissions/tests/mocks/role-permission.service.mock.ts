const rolePermission = [
  {
    id: '1',
    shortName: 'testName',
    shortCode: 'testShortCode',
    status: '1',
    roleId: '11',
    actionId: '12',
    permissionId: '13',
  },
  {
    id: '2',
    shortName: 'test2Name',
    shortCode: 'test2ShortCode',
    status: '21',
    roleId: '21',
    actionId: '22',
    permissionId: '23',
  },
];

export const mockRolePermissionService = {
  create: jest.fn((dto) => {
    return {
      id: '123',
      ...dto,
    };
  }),
  findAll: jest.fn(() => {
    return rolePermission;
  }),
  findOne: jest.fn((id) => {
    return rolePermission.filter(
      (rolePermission) => rolePermission.id === id,
    )[0];
  }),
  update: jest.fn((id, dto) => {
    let objToBeChanged = rolePermission.filter(
      (rolePermission) => rolePermission.id === id,
    )[0];

    if (!objToBeChanged) {
      return {
        statusCode: 404,
        message: 'No role permission with given ID could be found.',
        error: 'Not Found',
      };
    } else {
      return {
        ...dto,
        id: '33',
      };
    }
  }),
  remove: jest.fn((id) => {
    let objToBeChanged = rolePermission.filter(
      (rolePermission) => rolePermission.id === id,
    )[0];

    if (!objToBeChanged) {
      return {
        statusCode: 404,
        message: 'No role permission with given ID could be found.',
        error: 'Not Found',
      };
    } else {
      return {
        id: objToBeChanged.id,
        shortName: objToBeChanged.shortName,
        shortCode: objToBeChanged.shortCode,
        status: objToBeChanged.status,
      };
    }
  }),
};
