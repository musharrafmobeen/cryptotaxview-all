import { User } from 'coinbase';
import { PaymentPlan } from 'src/models/payment-plans/entities/payment-plan.entity';

export class CreateUserplanDto {
  dateOfSubscription: Date;
  dateOfUpgrade: Date;
  formula: JSON;
  status: number;
  paymentPlan: PaymentPlan[];
  user: string;
  type: string;
}
