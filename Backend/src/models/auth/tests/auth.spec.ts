import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockAuthService } from './mocks/auth.service.mock';

describe('Auth', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should authenticate a valid user', () => {
    const authenticateUserObject = {
      email: 'user1email',
      password: 'user1password',
    };
    expect(controller.authenticateUser(authenticateUserObject)).toMatchObject({
      user: { profile: {}, role: {} },
      token: 'testtoken',
    });
  });
  it('should not authenticate a in-valid user', () => {
    const authenticateUserObject = {
      email: 'abc',
      password: 'abc',
    };
    expect(controller.authenticateUser(authenticateUserObject)).toMatchObject({
      statusCode: 401,
      message: 'Email or Password is incorrect.',
    });
  });

  // it('should view all permission', () => {
  //   expect(controller.findAll()).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({
  //         id: expect.any(String),
  //         name: expect.any(String),
  //         shortCode: expect.any(String),
  //         level: expect.any(Number),
  //       }),
  //     ]),
  //   );
  //   expect(controller.findAll);
  // });

  // it('should view specific permission by id', () => {
  //   expect(controller.findOne('1')).toEqual({
  //     id: expect.any(String),
  //     name: expect.any(String),
  //     shortCode: expect.any(String),
  //     level: expect.any(Number),
  //   });
  //   expect(controller.findOne);
  // });
});
