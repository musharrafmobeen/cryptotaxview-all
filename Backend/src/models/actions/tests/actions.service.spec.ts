import { Test, TestingModule } from '@nestjs/testing';
import { ActionsRepository } from '../actions.repository';
import { ActionsService } from '../actions.service';
import { mockActionRepository } from './mocks/actions.repository.mock';
describe('ActionService', () => {
  let service: ActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsService, ActionsRepository],
    })
      .overrideProvider(ActionsRepository)
      .useValue(mockActionRepository)
      .compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an action', () => {
    const createActionObject = {
      name: 'test',
      actions: ['action1', 'action2', 'action3'],
    };
    expect(service.create(createActionObject)).toEqual({
      ...createActionObject,
      id: expect.any(String),
    });
    expect(service.create);
  });

  it('should view all actions', () => {
    expect(service.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          actions: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
    expect(service.findAll);
  });

  it('should view specific action by id', () => {
    expect(service.findOne('1')).toEqual({
      id: expect.any(String),
      actions: expect.arrayContaining([expect.any(String)]),
      name: expect.any(String),
    });
    expect(service.findOne);
  });
});
