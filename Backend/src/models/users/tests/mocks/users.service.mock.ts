const users = [
  {
    id: '1',
    email: 'test@test.com',
    password: 'password',
  },
  {
    id: '2',
    email: 'test2@test2.com',
    password: 'password2',
  },
];
export const mockUserService = {
  create: jest.fn((id, dto) => {
    return {
      id: '123',
      ...dto,
    };
  }),
  findAll: jest.fn(() => {
    return users;
  }),
  findOne: jest.fn((id) => {
    return users.filter((action) => action.id === id)[0];
  }),
  update: jest.fn((id, dto) => {
    let objToBeChanged = users.filter((user) => user.id === id)[0];

    if (!objToBeChanged) {
      return {
        statusCode: 404,
        message: 'No User with given ID could be found.',
        error: 'Not Found',
      };
    } else {
      return {
        id: '123',
        ...dto,
      };
    }
  }),
  updateProfile: jest.fn((id, dto) => {
    let objToBeChanged = users.filter((user) => user.id === id)[0];

    if (!objToBeChanged) {
      return {
        statusCode: 404,
        message: 'No User with given ID could be found.',
        error: 'Not Found',
      };
    } else {
      return {
        created_at: '2022-03-16T06:26:02.320Z',
        updated_at: '2022-03-16T11:17:33.156Z',
        id: '2d298353-9803-46b8-95b6-3053aa878814',
        email: 'test@test.com',
        lastLogIn: '2022-03-16T11:17:33.152Z',
        status: 1,
        firstName: 'String',
      };
    }
  }),
  remove: jest.fn((id) => {
    let objToBeChanged = users.filter((user) => user.id === id)[0];

    if (!objToBeChanged) {
      return {
        statusCode: 404,
        message: 'No User with the given ID found.',
        error: 'Not Found',
      };
    } else {
      return {
        created_at: '2022-03-16T10:07:15.914Z',
        updated_at: '2022-03-16T11:25:23.117Z',
        id: '23fa6b1a-fd45-449b-a350-3fbc5e0c79d5',
        email: 'email@email.com',
        lastLogIn: '2022-03-16T10:07:15.913Z',
        status: 0,
      };
    }
  }),
};
