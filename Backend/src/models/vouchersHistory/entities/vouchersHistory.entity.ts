import { Userplan } from 'src/models/userPlan/entities/userPlan.entity';
import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Vouchershistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  clientID: string;
  @Column({ type: 'varchar' })
  accountantID: string;
  @Column({ type: 'varchar', default: '' })
  fiscalYear: string;
  @Column({ type: 'varchar', default: '' })
  creditYear: string;
}
