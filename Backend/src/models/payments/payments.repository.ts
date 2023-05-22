import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, price: number) {
    return await this.paymentRepository.save({ ...createPaymentDto, price });
  }

  findAll() {
    return `This action returns all paymentPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentPlan`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} paymentPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentPlan`;
  }
}
