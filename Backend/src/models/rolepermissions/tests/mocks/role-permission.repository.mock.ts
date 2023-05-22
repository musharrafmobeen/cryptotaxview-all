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

export const mockRolePermissionRepository = {
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
};
