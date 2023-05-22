const users = [
  {
    id: '1',
    email: 'user1email',
    password: 'user1password',
  },
  {
    id: '2',
    email: 'user2email',
    password: 'user2password',
  },
];

export const mockAuthService = {
  validateUser: jest.fn((email, password) => {
    if (
      users.filter((user) => user.email === email && user.password === password)
        .length
    )
      return {
        user: { profile: {}, role: {} },
        token: 'testtoken',
      };
    else
      return {
        statusCode: 401,
        message: 'Email or Password is incorrect.',
      };
  }),
};
