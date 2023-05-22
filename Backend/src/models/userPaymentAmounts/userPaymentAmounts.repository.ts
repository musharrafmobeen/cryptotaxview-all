
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserpaymentamountsDto } from './dto/create-userPaymentAmounts.dto';
import { UpdateUserpaymentamountsDto } from './dto/update-userPaymentAmounts.dto';
import { Userpaymentamounts } from './entities/userPaymentAmounts.entity';

@Injectable()
export class UserpaymentamountsRepository {
  constructor(
    @Inject('USERPAYMENTAMOUNTS_REPOSITORY')
    private userPaymentAmountsRepository: Repository<Userpaymentamounts>,
  ) {}

  async create(createUserpaymentamountsDto: CreateUserpaymentamountsDto) {
    return await this.userPaymentAmountsRepository.save(createUserpaymentamountsDto);
  }

  async findAll() {
    return await this.userPaymentAmountsRepository.find();
  }

  async findOne(id: string) {
    return await this.userPaymentAmountsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserpaymentamountsDto: UpdateUserpaymentamountsDto) {
    const userPaymentAmounts = await this.userPaymentAmountsRepository.findOne({ where: { id } });

    if (!userPaymentAmounts){
      throw new HttpException('userPaymentAmounts not found', HttpStatus.NOT_FOUND);
    }

    return this.userPaymentAmountsRepository.save({
      ...userPaymentAmounts, // existing fields
      ...updateUserpaymentamountsDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.userPaymentAmountsRepository.delete({ id });
  }
}         
