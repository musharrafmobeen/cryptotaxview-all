import { PaymentPlan } from 'src/models/payment-plans/entities/payment-plan.entity';
import { User } from 'src/models/users/entities/user.entity';
import { Vouchershistory } from 'src/models/vouchersHistory/entities/vouchersHistory.entity';
import {
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Userplan {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'date' })
  dateOfSubscription: Date;
  @Column({ type: 'date', default: null })
  dateOfUpgrade: Date;
  @Column({ type: 'jsonb' })
  formula: JSON;
  @Column({ type: 'int' })
  status: number;
  @Column({ type: 'varchar' })
  user: string;
  @Column({ type: 'varchar', default: null })
  type: string;
  @ManyToMany(() => PaymentPlan)
  @JoinTable()
  paymentPlan: PaymentPlan[];
}
