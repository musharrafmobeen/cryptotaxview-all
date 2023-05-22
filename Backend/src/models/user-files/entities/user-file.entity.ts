import { User } from 'src/models/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  exchange: string;

  @Column('varchar')
  fileName: string;

  @Column('varchar')
  originalFileName: string;

  @Column('boolean')
  type: boolean;

  @Column('varchar')
  user: string;

  @Column('varchar')
  createdAt: string;
}
