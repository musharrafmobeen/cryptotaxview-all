import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderHistoryExport extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'timestamp' })
  transactionDate: Date;
  @Column({
    type: 'varchar',
  })
  orderNo: string;
  @Column({
    type: 'varchar',
    length: 15,
  })
  pair: string;
  @Column({
    type: 'varchar',
    length: 15,
  })
  type: string;
  @Column({
    type: 'varchar',
    length: 15,
  })
  side: string;
  @Column({
    type: 'float',
  })
  orderPrice: number;
  @Column({ type: 'float' })
  orderAmount: number;
  @Column({ type: 'timestamp' })
  time: Date;
  @Column({ type: 'float' })
  executed: number;
  @Column({ type: 'float' })
  averagePrice: number;
  @Column({ type: 'float' })
  tradingTotal: number;
  @Column({ type: 'varchar' })
  status: string;
}
