import { Payment } from './entities/payment.entity';
import { Connection } from 'typeorm';

export const paymentProviders = [
  {
    provide: 'PAYMENT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Payment),
    inject: ['DATABASE_CONNECTION'],
  },
];
