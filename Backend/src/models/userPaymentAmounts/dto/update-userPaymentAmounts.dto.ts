
  import { PartialType } from '@nestjs/mapped-types';
import { CreateUserpaymentamountsDto } from './create-userPaymentAmounts.dto';

export class UpdateUserpaymentamountsDto extends PartialType(CreateUserpaymentamountsDto) {}
