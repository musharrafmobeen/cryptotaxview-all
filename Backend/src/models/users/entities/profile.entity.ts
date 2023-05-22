import { TimeStamps } from '../../../common/entities/timestamps.entities';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  firstName: string;

  @Column({ type: 'varchar', length: 25 })
  lastName: string;

  @Column({ type: 'varchar', length: 25 })
  username: string;

  @Column({ type: 'varchar' })
  contact: string;

  @Column({ type: 'json', default: '{}', nullable: true })
  country: JSON;

  @Column({ type: 'json', default: '{}', nullable: true })
  currency: JSON;

  @Column({ type: 'json', default: '{}', nullable: true })
  timezone: JSON;

  @Column({ type: 'json', default: '{}', nullable: true })
  cgtcalmethod: JSON;

  @Column({ type: 'int', default: 1 })
  status: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
