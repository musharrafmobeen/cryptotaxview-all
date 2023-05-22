import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';

@Injectable()
export class ActionsRepository {
  constructor(
    @Inject('ACTION_REPOSITORY')
    private actionsRepository: Repository<Action>,
  ) {}

  async lookUpAction(id: string) {
    return await this.actionsRepository.findOne({ id });
  }

  async create(createActionDto: CreateActionDto) {
    return await this.actionsRepository.save(createActionDto);
  }

  async findAll() {
    return await this.actionsRepository.find();
  }

  async findOne(id: string) {
    return await this.actionsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateActionDto: UpdateActionDto) {
    const action = await this.actionsRepository.findOne({ where: { id } });

    return this.actionsRepository.save({
      ...action, // existing fields
      ...updateActionDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.actionsRepository.delete({ id });
  }
}
