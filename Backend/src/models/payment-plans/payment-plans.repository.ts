import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PaymentPlan } from './entities/payment-plan.entity';

@Injectable()
export class PaymentPlansRepository {
  constructor(
    @Inject('PAYMENT_PLAN_REPOSITORY')
    private paymentPlanRepository: Repository<PaymentPlan>,
  ) {}

  create(createPaymentPlanDto: CreatePaymentPlanDto) {
    return this.paymentPlanRepository.save({
      ...createPaymentPlanDto,
      time: createPaymentPlanDto.time.getTime(),
    });
  }

  findAll() {
    return this.paymentPlanRepository.find({
      relations: ['userPaymentAmounts'],
    });
  }

  async findOne(id: string) {
    const paymentPlan = await this.paymentPlanRepository.findOne({
      where: { id },
      relations: ['userPaymentAmounts'],
    });
    if (!paymentPlan)
      throw new HttpException('payment plan not found', HttpStatus.NOT_FOUND);
    return paymentPlan;
  }

  async update(id: string, updatePaymentPlanDto: UpdatePaymentPlanDto) {
    const paymentPlan = await this.paymentPlanRepository.findOne({
      where: { id },
    });
    if (!paymentPlan)
      throw new HttpException('payment plan not found', HttpStatus.NOT_FOUND);
    let time = 0;
    if (updatePaymentPlanDto.time) {
      time = updatePaymentPlanDto.time.getTime();
    } else {
      time = paymentPlan.time;
    }
    return this.paymentPlanRepository.save({
      ...paymentPlan,
      ...updatePaymentPlanDto,
      time,
    });
  }

  remove(id: string) {
    return this.paymentPlanRepository.delete(id);
  }
}
