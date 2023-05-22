import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Alliedaccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  userID: string;
  @Column({ type: 'varchar' })
  accountAddress: string;
  @Column({ type: 'boolean' })
  active: boolean;
}
