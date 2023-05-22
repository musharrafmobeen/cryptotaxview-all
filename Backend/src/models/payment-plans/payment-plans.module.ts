import { Module } from '@nestjs/common';
import { PaymentPlansService } from './payment-plans.service';
import { PaymentPlansController } from './payment-plans.controller';
import { PaymentPlansRepository } from './payment-plans.repository';
import { paymentPlanProviders } from './payment-plans.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserplanModule } from '../userPlan/userPlan.module';
import { UserpaymentamountsModule } from '../userPaymentAmounts/userPaymentAmounts.module';

@Module({
  imports: [
    DatabaseModule,
    TransactionsModule,
    UserplanModule,
    UserpaymentamountsModule,
  ],
  controllers: [PaymentPlansController],
  providers: [
    PaymentPlansService,
    PaymentPlansRepository,
    ...paymentPlanProviders,
  ],
  exports: [
    PaymentPlansService,
    PaymentPlansRepository,
    ...paymentPlanProviders,
  ],
})
export class PaymentPlansModule {}
