import { User } from 'src/models/users/entities/user.entity';
import {
  OneToOne,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
@Entity()
export class Ledgers {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  accountantID: string;
  @Column({ type: 'varchar' })
  fiscalYear: string;
  @Column({ type: 'varchar' })
  date: string;
  @Column({ type: 'int', nullable: true })
  credit: number;
  @Column({ type: 'int' })
  balance: number;
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
