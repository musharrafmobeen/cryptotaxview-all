import { PaymentPlan } from './entities/payment-plan.entity';
import { Connection } from 'typeorm';

export const paymentPlanProviders = [
  {
    provide: 'PAYMENT_PLAN_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(PaymentPlan),
    inject: ['DATABASE_CONNECTION'],
  },
];
