import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderHistoryImport extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userID: string;

  @Column({ type: 'timestamptz' })
  transactionDate: Date;

  @Column({
    type: 'varchar',
    length: 15,
  })
  type: string;

  @Column({ type: 'varchar', length: 20 })
  market: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  rateIncFee: number;

  @Column({ type: 'float' })
  rateExcFee: number;

  @Column({ type: 'float' })
  fee: number;

  @Column({ type: 'varchar', length: 15 })
  feeCurrency: string;

  @Column({ type: 'float' })
  feeAudIncGst: number;

  @Column({ type: 'float' })
  gstAud: number;

  @Column({ type: 'float' })
  totalAud: number;

  @Column({ type: 'float' })
  totalIncGst: number;

  @Column({ type: 'varchar', length: 15 })
  totalIncGstCurrency: string;

  @Column({ type: 'varchar' })
  exchange: string;
}
