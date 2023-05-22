import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ExchangePair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  exchange: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column('simple-array')
  keys: string[]; 

  @Column({ type: 'varchar' })
  userID: string;

  @Column({ type: 'varchar' })
  source: string;

  @Column({ type: 'varchar', default: '0' })
  lastSynced: number;
}
