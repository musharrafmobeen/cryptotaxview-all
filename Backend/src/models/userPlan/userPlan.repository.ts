import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserplanDto } from './dto/create-userPlan.dto';
import { UpdateUserplanDto } from './dto/update-userPlan.dto';
import { Userplan } from './entities/userPlan.entity';

@Injectable()
export class UserplanRepository {
  constructor(
    @Inject('USERPLAN_REPOSITORY')
    private userPlanRepository: Repository<Userplan>,
  ) {}

  async create(createUserplanDto: CreateUserplanDto) {
    return await this.userPlanRepository.save(createUserplanDto);
  }

  async findAll() {
    return await this.userPlanRepository.find();
  }

  async findOne(id: string) {
    return await this.userPlanRepository.findOne({ where: { id } });
  }

  async findByUserID(id: string) {
    return await this.userPlanRepository.find({
      where: { user: id, status: 1 },
      relations: ['paymentPlan'],
    });
  }

  async findByUserIDAndFiscalYear(id: string) {
    return await this.userPlanRepository.find({
      where: { user: id, status: 1 },
      relations: ['paymentPlan'],
    });
  }

  async update(id: string, updateUserplanDto: UpdateUserplanDto) {
    const userPlan = await this.userPlanRepository.findOne({ where: { id } });

    if (!userPlan) {
      throw new HttpException('userPlan not found', HttpStatus.NOT_FOUND);
    }

    return this.userPlanRepository.save({
      ...userPlan, // existing fields
      ...updateUserplanDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.userPlanRepository.delete({ id });
  }
}
