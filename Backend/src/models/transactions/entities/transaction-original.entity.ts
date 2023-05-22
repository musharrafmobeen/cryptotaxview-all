import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/models/users/entities/user.entity';

@Entity()
export class OriginalTransaction {
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
  @Column({ type: 'timestamp without time zone' })
  datetime: Date;
  @Column({ type: 'double precision' })
  cost: number;
  @Column({ type: 'varchar' })
  side: string;
  @Column({ type: 'jsonb' })
  fee: JSON;
  @Column({ type: 'varchar' })
  user: string;
  @Column({ type: 'varchar', default: 'other trx' })
  taxType: string;
  @Column({ type: 'varchar', default: '' })
  fileName: string;
  @Column({ type: 'jsonb' })
  cgt: JSON;
  @Column({ type: 'jsonb' })
  fifoCGTDetail: JSON;
  @Column({ type: 'jsonb' })
  lifoCGTDetail: JSON;
  @Column({ type: 'varchar' })
  fifoRelatedTransactions: string;
  @Column({ type: 'varchar' })
  lifoRelatedTransactions: string;
  @Column({ type: 'double precision', default: 0 })
  currentBoughtCoinBalance: number;
  @Column({ type: 'double precision', default: 0 })
  currentSoldCoinBalance: number;
  @Column({ type: 'boolean' })
  isError: Boolean;
  @Column({ type: 'double precision' })
  priceInAud: number;
  @Column({ type: 'double precision' })
  previousCoinBalance: number;
  @Column({ type: 'double precision' })
  currentCoinBalance: number;
  @Column({ type: 'double precision' })
  previousCoin2Balance: number;
  @Column({ type: 'double precision' })
  currentCoin2Balance: number;
  @Column({ type: 'jsonb' })
  balance: JSON;
}
