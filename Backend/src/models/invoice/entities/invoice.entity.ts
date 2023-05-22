import { User } from 'src/models/users/entities/user.entity';
import {
  ManyToOne,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'date' })
  dateOfInvoice: Date;
  @Column({ type: 'double precision' })
  invoiceAmount: number;
  @Column({ type: 'date' })
  expiryDate: Date;
  @Column({ type: 'date' })
  chargedOn: Date;
  @Column({ type: 'varchar' })
  mode: string;
  @Column({ type: 'int' })
  status: number;
  @ManyToOne(() => User, (user) => user.invoice)
  @JoinColumn()
  user: User;
  @Column({ type: 'varchar' })
  pId: string;
}
