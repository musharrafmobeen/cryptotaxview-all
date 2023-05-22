const permissions = [
  {
    id: '1',
    name: 'testName',
    shortCode: 'testShortCode',
    level: 1,
  },
  {
    id: '2',
    name: 'test2Name',
    shortCode: 'test2ShortCode',
    level: 2,
  },
];

export const mockPermissionRepository = {
  create: jest.fn((dto) => {
    return {
      id: '123',
      ...dto,
    };
  }),
  findAll: jest.fn(() => {
    return permissions;
  }),
  findOne: jest.fn((id) => {
    return permissions.filter((permission) => permission.id === id)[0];
  }),
};
