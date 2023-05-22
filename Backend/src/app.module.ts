import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './models/roles/roles.module';
import { UsersModule } from './models/users/users.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { ActionsModule } from './models/actions/actions.module';
import { RolepermissionsModule } from './models/rolepermissions/rolepermissions.module';
import { AuthModule } from './models/auth/auth.module';
import { ExchangesWrapperModule } from './models/exchanges-wrapper/exchanges-wrapper.module';
import { OrderHistoryExportModule } from './models/order-history-export/order-history-export.module';
import { OrderHistoryImportModule } from './models/order-history-import/order-history-import.module';
import { TransactionsModule } from './models/transactions/transactions.module';
import { ExchangePairsModule } from './models/exchange-pairs/exchange-pairs.module';
import { userMiddleware } from './common/middlewares/getUser.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UserFilesModule } from './models/user-files/user-files.module';
import { multerMiddleware } from './common/middlewares/multerMiddleware';
import { AppGateway } from './app.gateway';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './models/email/email.module';
import { CsvConfigurationsModule } from './models/csv-configurations/csv-configurations.module';
import { MetamaskModule } from './models/metamask/metamask.module';
import { ExchangeMasterTableModule } from './models/exchange_master_table/exchange_master_table.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ReferralsModule } from './models/referrals/referrals.module';
import { BitcoinModule } from './models/bitcoin/bitcoin.module';
import { PaymentPlansModule } from './models/payment-plans/payment-plans.module';
import { PaymentsModule } from './models/payments/payments.module';
import { InvoiceModule } from './models/invoice/invoice.module';
import { UserplanModule } from './models/userPlan/userPlan.module';
import { UserpaymentamountsModule } from './models/userPaymentAmounts/userPaymentAmounts.module';
import { AlliedaccountsModule } from './models/alliedAccounts/alliedAccounts.module';
import { VouchershistoryModule } from './models/vouchersHistory/vouchersHistory.module';
import { LedgersModule } from './models/ledgers/ledgers.module';

@Module({
  imports: [
    VouchershistoryModule,
    AlliedaccountsModule,
    UserpaymentamountsModule,
    UserplanModule,
    RolesModule,
    UsersModule,
    PermissionsModule,
    ActionsModule,
    RolepermissionsModule,
    AuthModule,
    LedgersModule,
    ExchangesWrapperModule,
    OrderHistoryImportModule,
    OrderHistoryExportModule,
    TransactionsModule,
    ExchangePairsModule,
    EmailModule,
    JwtModule.register({ secret: 'secretKey' }),
    UserFilesModule,
    MetamaskModule,
    InvoiceModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.example.com',
          port: 587,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: 'musharrafmobeen32@gmail.com',
            pass: 'Blackviking125',
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    CsvConfigurationsModule,
    ExchangeMasterTableModule,
    ReferralsModule,
    BitcoinModule,
    PaymentPlansModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(multerMiddleware).forRoutes({
      path: 'order-history-import/upload',
      method: RequestMethod.POST,
    });
    consumer.apply(userMiddleware).forRoutes(
      { path: 'invoice/user', method: RequestMethod.GET },
      {
        path: 'vouchersHistory/vouchers/:fiscalYear',
        method: RequestMethod.GET,
      },
      {
        path: 'vouchersHistory/vouchers/all/clients',
        method: RequestMethod.GET,
      },
      { path: 'payment-plans/:fiscalYear', method: RequestMethod.GET },
      { path: 'payments', method: RequestMethod.POST },
      { path: 'ledgers', method: RequestMethod.GET },
      { path: 'payments/professional', method: RequestMethod.POST },
      { path: 'alliedAccounts', method: RequestMethod.POST },
      { path: 'alliedAccounts/:client', method: RequestMethod.POST },
      { path: 'alliedAccounts', method: RequestMethod.GET },
      { path: 'alliedAccounts/clients/:client', method: RequestMethod.GET },
      { path: 'alliedAccounts/:id', method: RequestMethod.GET },
      { path: 'alliedAccounts/:id', method: RequestMethod.PATCH },
      { path: 'alliedAccounts/clients/:client', method: RequestMethod.PATCH },
      { path: 'users/user-invite', method: RequestMethod.POST },
      { path: 'users/multiple-invitation', method: RequestMethod.POST },
      { path: 'users/users-invitation', method: RequestMethod.POST },
      { path: 'user-files/files/:type', method: RequestMethod.GET },
      { path: 'user-files/files/:type/:client', method: RequestMethod.GET },
      { path: 'user-files', method: RequestMethod.POST },
      { path: 'referrals', method: RequestMethod.GET },
      { path: 'user-files/delete/files', method: RequestMethod.DELETE },
      { path: 'user-files/delete/files/:client', method: RequestMethod.DELETE },
      { path: 'exchanges-wrapper', method: RequestMethod.GET },
      {
        path: 'exchanges-wrapper/delete/reports',
        method: RequestMethod.DELETE,
      },
      { path: 'exchanges-wrapper/binance/sync', method: RequestMethod.GET },
      {
        path: 'exchanges-wrapper/download/report/:filename',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/download/report/:filename/:client',
        method: RequestMethod.GET,
      },
      { path: 'exchanges-wrapper/binance/sync', method: RequestMethod.GET },
      {
        path: 'exchanges-wrapper/excel',
        method: RequestMethod.POST,
      },
      {
        path: 'exchanges-wrapper/excel/holdings',
        method: RequestMethod.POST,
      },
      {
        path: 'exchanges-wrapper/excel/:client',
        method: RequestMethod.POST,
      },
      {
        path: 'exchanges-wrapper/account/:exchange',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/pdf',
        method: RequestMethod.POST,
      },
      {
        path: 'exchanges-wrapper/pdf/:client',
        method: RequestMethod.POST,
      },
      {
        path: 'exchanges-wrapper/sync/:exchange/:name',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/sync/:exchange/:name/:client',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/sync/status/:exchange',
        method: RequestMethod.GET,
      },
      { path: 'exchange-pairs', method: RequestMethod.POST },
      {
        path: 'exchange-pairs/professional/:client',
        method: RequestMethod.POST,
      },

      { path: 'exchange-pairs', method: RequestMethod.GET },
      { path: 'exchange-pairs/retrieve', method: RequestMethod.POST },
      { path: 'exchange-pairs/retrieve/:client', method: RequestMethod.POST },
      { path: 'exchange-pairs/:exchange/:name', method: RequestMethod.DELETE },
      {
        path: 'exchange-pairs/:exchange/:name/:client',
        method: RequestMethod.DELETE,
      },
      { path: 'exchanges-wrapper', method: RequestMethod.GET },
      {
        path: 'exchanges-wrapper/holdings/:exchange',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/holdings/:exchange/:client',
        method: RequestMethod.GET,
      },
      {
        path: 'exchanges-wrapper/delete/reports',
        method: RequestMethod.DELETE,
      },
      {
        path: 'exchanges-wrapper/delete/reports/:client',
        method: RequestMethod.DELETE,
      },
      { path: 'auth/token/refresh', method: RequestMethod.GET },
      { path: 'transactions/amount/:exchange', method: RequestMethod.POST },
      { path: 'transactions', method: RequestMethod.PATCH },
      { path: 'transactions/:client', method: RequestMethod.PATCH },
      { path: 'transactions/create', method: RequestMethod.POST },
      { path: 'transactions/create/:client', method: RequestMethod.POST },
      { path: 'transactions/reset', method: RequestMethod.GET },
      {
        path: 'transactions/remove-some/:client',
        method: RequestMethod.DELETE,
      },
      { path: 'transactions/remove-some', method: RequestMethod.DELETE },
      { path: 'transactions/reset/:client', method: RequestMethod.GET },
      { path: 'transactions/:take/:skip', method: RequestMethod.POST },
      { path: 'transactions/:take/:skip/:client', method: RequestMethod.POST },
      {
        path: 'exchanges-wrapper/trades/:exchange/:algorithm',
        method: RequestMethod.GET,
      },
      {
        path: 'order-history-import/upload/:exchange/:insertionType',
        method: RequestMethod.POST,
      },
      {
        path: 'order-history-import/upload/:exchange/:insertionType/:client',
        method: RequestMethod.POST,
      },
      { path: 'order-history-import/CSV-Data', method: RequestMethod.GET },
    );
  }
}
