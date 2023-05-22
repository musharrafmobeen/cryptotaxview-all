import { Injectable } from '@nestjs/common';
import { ActionsRepository } from './actions.repository';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionsService {
  constructor(private readonly actionsRepository: ActionsRepository) {}

  create(createActionDto: CreateActionDto) {
    return this.actionsRepository.create(createActionDto);
  }

  findAll() {
    return this.actionsRepository.findAll();
  }

  findOne(id: string) {
    return this.actionsRepository.findOne(id);
  }

  update(id: string, updateActionDto: UpdateActionDto) {
    return this.actionsRepository.update(id, updateActionDto);
  }

  remove(id: string) {
    return this.actionsRepository.remove(id);
  }

  lookUpAction(actionId: string) {
    return this.actionsRepository.lookUpAction(actionId);
  }
}
