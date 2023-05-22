import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { PaymentRepository } from './payments.repository';
import { paymentProviders } from './payments.providers';
import { PaymentPlansModule } from '../payment-plans/payment-plans.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { UserplanModule } from '../userPlan/userPlan.module';
import { UserpaymentamountsModule } from '../userPaymentAmounts/userPaymentAmounts.module';
import { LedgersModule } from '../ledgers/ledgers.module';

@Module({
  imports: [
    DatabaseModule,
    PaymentPlansModule,
    UsersModule,
    RolesModule,
    TransactionsModule,
    InvoiceModule,
    UserplanModule,
    UserpaymentamountsModule,
    LedgersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository, ...paymentProviders],
  exports: [PaymentsService, PaymentRepository, ...paymentProviders],
})
export class PaymentsModule {}
