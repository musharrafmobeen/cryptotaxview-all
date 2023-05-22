import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  referrersID: string;

  @Column({ type: 'varchar' })
  managedBy: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'simple-array' })
  exchanges: string[];

  @Column({ type: 'int' })
  status: number;
}
