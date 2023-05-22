import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/models/users/entities/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  exchange: string;
  @Column({ type: 'varchar' })
  source: string;
  @Column({ type: 'varchar' })
  symbol: string;
  @Column({ type: 'double precision' })
  price: number;
  @Column({ type: 'double precision' })
  amount: number;
  @Column({ type: 'varchar', default: '' })
  fileName: string;
  @Column({ type: 'timestamp without time zone' })
  datetime: Date;
  @Column({ type: 'double precision' })
  cost: number;
  @Column({ type: 'varchar' })
  side: string;
  @Column({ type: 'jsonb' })
  fee: JSON;
  @Column({ type: 'boolean' })
  isError: Boolean;
  @Column({ type: 'double precision' })
  priceInAud: number;
  @Column({ type: 'varchar' })
  user: string;
  @Column({ type: 'jsonb' })
  balance: JSON;
  @Column({ type: 'jsonb' })
  cgt: JSON;
  @Column({ type: 'varchar', default: 'other trx' })
  taxType: string;
  @Column({ type: 'jsonb' })
  fifoCGTDetail: JSON;
  @Column({ type: 'jsonb' })
  lifoCGTDetail: JSON;
  @Column({ type: 'varchar', default: '' })
  accountAddress: string;
  @Column({ type: 'varchar' })
  fifoRelatedTransactions: string;
  @Column({ type: 'varchar' })
  lifoRelatedTransactions: string;
  @Column({ type: 'double precision', default: 0 })
  currentBoughtCoinBalance: number;
  @Column({ type: 'double precision', default: 0 })
  currentSoldCoinBalance: number;
  @Column({ type: 'double precision', default: 0 })
  previousCoinBalance: number;
  @Column({ type: 'double precision', default: 0 })
  currentCoinBalance: number;
  @Column({ type: 'double precision', default: 0 })
  previousCoin2Balance: number;
  @Column({ type: 'double precision', default: 0 })
  currentCoin2Balance: number;
}
