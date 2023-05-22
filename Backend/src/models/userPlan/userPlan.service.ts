import { Injectable } from '@nestjs/common';
import { UserplanRepository } from './userPlan.repository';
import { CreateUserplanDto } from './dto/create-userPlan.dto';
import { UpdateUserplanDto } from './dto/update-userPlan.dto';

@Injectable()
export class UserplanService {
  constructor(private readonly userPlanRepository: UserplanRepository) {}

  create(createUserplanDto: CreateUserplanDto) {
    return this.userPlanRepository.create(createUserplanDto);
  }

  findAll() {
    return this.userPlanRepository.findAll();
  }

  findOne(id: string) {
    return this.userPlanRepository.findOne(id);
  }

  findByUserID(id: string) {
    return this.userPlanRepository.findByUserID(id);
  }

  async findByUserIDAndFiscalYear(id: string, fiscalYear: string) {
    const userPlans = await this.userPlanRepository.findByUserIDAndFiscalYear(
      id,
    );
    return userPlans.filter((userPlan) =>
      userPlan.formula.hasOwnProperty(fiscalYear),
    );
  }

  update(id: string, updateUserplanDto: UpdateUserplanDto) {
    return this.userPlanRepository.update(id, updateUserplanDto);
  }

  remove(id: string) {
    return this.userPlanRepository.remove(id);
  }
}
