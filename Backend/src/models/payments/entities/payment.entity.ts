import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userID: string;

  @Column({ type: 'varchar' })
  paymentPlan: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'date' })
  date: Date;

  @Column('double precision')
  price: number;
}
