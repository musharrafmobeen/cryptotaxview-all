import { Userpaymentamounts } from 'src/models/userPaymentAmounts/entities/userPaymentAmounts.entity';

export class CreatePaymentPlanDto {
  name: string;
  price: number;
  type: string;
  info: JSON;
  time: Date;
  roleShortCode: string;
  userPaymentAmounts: Userpaymentamounts;
  order: number;
}
