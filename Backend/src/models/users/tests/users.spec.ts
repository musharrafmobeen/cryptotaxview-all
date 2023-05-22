import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { mockUserService } from './mocks/users.service.mock';

describe('Users', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an action call to the repository', () => {
    const createUserObject = {
      email: 'email@email.com',
      password: 'doctest',
      firstName: 'doctest',
      lastName: 'doctest',
      username: 'doctest',
      contact: '+92300-1234567',
      lastLogIn: null,
      role: null,
    };
    expect(controller.create(createUserObject, '1')).toEqual({
      id: expect.any(String),
      ...createUserObject,
    });
    expect(controller.create);
  });

  it('should view all users', () => {
    expect(controller.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
        }),
      ]),
    );
  });

  it('should view specific user by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
    });
    expect(controller.findOne);
  });

  it('should update secific user by id', () => {
    const createUserObject = {
      email: 'email@email.com',
      password: 'doctest',
      firstName: 'doctest',
      lastName: 'doctest',
      username: 'doctest',
      contact: '+92300-1234567',
      lastLogIn: '',
      role: null,
    };
    expect(controller.update('1', createUserObject)).toEqual({
      id: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      contact: expect.any(String),
      firstName: expect.any(String),
      lastLogIn: expect.any(String),
      lastName: expect.any(String),
      role: expect.any(Object),
      username: expect.any(String),
    });
    expect(controller.findOne);
  });

  it('should update specific users profile by id', () => {
    const createProfileObject = {
      firstName: 'string',
      lastName: 'string',
      username: 'username',
      contact: '+92300-1234567',
      status: 1,
    };
    expect(controller.updateProfile('1', createProfileObject)).toEqual({
      created_at: expect.any(String),
      updated_at: expect.any(String),
      id: expect.any(String),
      email: expect.any(String),
      lastLogIn: expect.any(String),
      status: expect.any(Number),
      firstName: expect.any(String),
    });
    expect(controller.findOne);
  });
  it('should delete users profile by id', () => {
    expect(controller.remove('1')).toEqual({
      created_at: expect.any(String),
      updated_at: expect.any(String),
      id: expect.any(String),
      email: expect.any(String),
      lastLogIn: expect.any(String),
      status: expect.any(Number),
    });
    expect(controller.findOne);
  });
});
