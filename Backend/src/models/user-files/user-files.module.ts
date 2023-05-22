import { forwardRef, Module } from '@nestjs/common';
import { UserFilesService } from './user-files.service';
import { UserFilesController } from './user-files.controller';
import { UserFilesRepository } from './user-files.repository';
import { userFileProviders } from './user-files.providers';
import { DatabaseModule } from 'src/config/database/database.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ExchangePairsModule } from '../exchange-pairs/exchange-pairs.module';

@Module({
  imports: [
    DatabaseModule,
    TransactionsModule,
    forwardRef(() => ExchangePairsModule),
  ],
  controllers: [UserFilesController],
  providers: [UserFilesService, UserFilesRepository, ...userFileProviders],
  exports: [UserFilesService, UserFilesRepository, ...userFileProviders],
})
export class UserFilesModule {}
