import { Userpaymentamounts } from 'src/models/userPaymentAmounts/entities/userPaymentAmounts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class PaymentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  roleShortCode: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column('int')
  time: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'jsonb' })
  info: JSON;

  @Column('double precision')
  price: number;

  @OneToOne(() => Userpaymentamounts)
  @JoinColumn()
  userPaymentAmounts: Userpaymentamounts;
}
