import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Userpaymentamounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'int' })
  minNoOfTransactions: number;
  @Column({ type: 'int', nullable: true, default: null })
  maxNoOfTransactions: number;
  @Column({ type: 'int', nullable: true, default: null })
  percentageValue: number;
  @Column({ type: 'int' })
  price: number;
  @Column({ type: 'int' })
  markUp: number;
}
