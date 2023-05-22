import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentPlansService } from './payment-plans.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';

@Controller('payment-plans')
export class PaymentPlansController {
  constructor(private readonly paymentPlansService: PaymentPlansService) {}

  @Post()
  create(@Body() createPaymentPlanDto: CreatePaymentPlanDto) {
    return this.paymentPlansService.create(createPaymentPlanDto);
  }

  @Get(':fiscalYear')
  findAll(
    @Body('userID') userID: string,
    @Param('fiscalYear') fiscalYear: string,
  ) {
    return this.paymentPlansService.findAll(userID, fiscalYear);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentPlansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentPlanDto: UpdatePaymentPlanDto,
  ) {
    return this.paymentPlansService.update(id, updatePaymentPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentPlansService.remove(id);
  }
}
