const actions = [
  {
    id: '1',
    name: 'test',
    actions: ['testAction1', 'testAction2', 'testAction3'],
  },
  {
    id: '2',
    name: 'test2',
    actions: ['test2Action1', 'test2Action2', 'test2Action3'],
  },
];
export const mockActionService = {
  create: jest.fn((dto) => {
    return {
      id: '123',
      ...dto,
    };
  }),
  findAll: jest.fn(() => {
    return actions;
  }),
  findOne: jest.fn((id) => {
    return actions.filter((action) => action.id === id)[0];
  }),
};
