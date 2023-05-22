const roles = [
  {
    id: '1',
    name: 'testName',
    shortCode: 'testShortCode',
    status: '1',
  },
  {
    id: '2',
    name: 'test2Name',
    shortCode: 'test2ShortCode',
    status: '2',
  },
];

export const mockRolesRepository = {
  create: jest.fn((dto) => {
    return {
      id: '123',
      ...dto,
    };
  }),
  findAll: jest.fn(() => {
    return roles;
  }),
  findOne: jest.fn((id) => {
    return roles.filter((role) => role.id === id)[0];
  }),
};
