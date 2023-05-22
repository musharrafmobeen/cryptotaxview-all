
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { UserpaymentamountsService } from './userPaymentAmounts.service';
import { UserpaymentamountsRepository } from './userPaymentAmounts.repository';
import { userPaymentAmountsProviders } from './userPaymentAmounts.providers';
import { UserpaymentamountsController } from './userPaymentAmounts.controller';

@Module({
  imports:[DatabaseModule],  
  controllers: [UserpaymentamountsController],
  providers: [UserpaymentamountsService, UserpaymentamountsRepository, ...userPaymentAmountsProviders],
  exports: [UserpaymentamountsService, UserpaymentamountsRepository, ...userPaymentAmountsProviders]
})
export class UserpaymentamountsModule {}
