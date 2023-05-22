import { forwardRef, Module } from '@nestjs/common';
import { ExchangePairsService } from './exchange-pairs.service';
import { ExchangePairsController } from './exchange-pairs.controller';
import { ExchangePairsRepository } from './exchange-pairs.repository';
import { exchangePairProviders } from './exchange-pairs.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserFilesModule } from '../user-files/user-files.module';
import { UsersModule } from '../users/users.module';
import { ReferralsModule } from '../referrals/referrals.module';

@Module({
  imports: [
    forwardRef(() => TransactionsModule),
    DatabaseModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '2h' },
    }),
    UserFilesModule,
    UsersModule,
    ReferralsModule,
  ],
  controllers: [ExchangePairsController],
  providers: [
    ExchangePairsService,
    ExchangePairsRepository,
    ...exchangePairProviders,
  ],
  exports: [
    ExchangePairsService,
    ExchangePairsRepository,
    ...exchangePairProviders,
  ],
})
export class ExchangePairsModule {}
