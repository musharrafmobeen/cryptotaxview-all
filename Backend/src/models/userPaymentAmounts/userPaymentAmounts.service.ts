
import { Injectable } from '@nestjs/common';
import { UserpaymentamountsRepository } from './userPaymentAmounts.repository';
import { CreateUserpaymentamountsDto } from './dto/create-userPaymentAmounts.dto';
import { UpdateUserpaymentamountsDto } from './dto/update-userPaymentAmounts.dto';

@Injectable()
export class UserpaymentamountsService {
  constructor(private readonly userPaymentAmountsRepository: UserpaymentamountsRepository) {}

  create(createUserpaymentamountsDto: CreateUserpaymentamountsDto) {
    return this.userPaymentAmountsRepository.create(createUserpaymentamountsDto);
  }

  findAll() {
    return this.userPaymentAmountsRepository.findAll();
  }

  findOne(id: string) {
    return this.userPaymentAmountsRepository.findOne(id);
  }

  update(id: string, updateUserpaymentamountsDto: UpdateUserpaymentamountsDto) {
    return this.userPaymentAmountsRepository.update(id, updateUserpaymentamountsDto);
  }

  remove(id: string) {
    return this.userPaymentAmountsRepository.remove(id);
  }
}
