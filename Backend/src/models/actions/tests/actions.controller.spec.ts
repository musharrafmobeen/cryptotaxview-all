import { Test, TestingModule } from '@nestjs/testing';

import { ActionsController } from '../actions.controller';
import { ActionsService } from '../actions.service';
import { mockActionService } from './mocks/actions.service.mock';

describe('ActionsController', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [ActionsService],
    })
      .overrideProvider(ActionsService)
      .useValue(mockActionService)
      .compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an action', () => {
    const createActionObject = {
      name: 'test',
      actions: ['action1', 'action2', 'action3'],
    };
    expect(controller.create(createActionObject)).toEqual({
      ...createActionObject,
      id: expect.any(String),
    });
    expect(mockActionService.create).toHaveBeenCalledWith(createActionObject);
  });

  it('should view all actions', () => {
    expect(controller.findAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          actions: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
    expect(mockActionService.findAll).toHaveBeenCalled();
  });

  it('should view specific action by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: expect.any(String),
      actions: expect.arrayContaining([expect.any(String)]),
      name: expect.any(String),
    });
    expect(mockActionService.findOne).toHaveBeenCalledWith('1');
  });
});
