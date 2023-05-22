import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { Profile } from '../entities/profile.entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { ExchangePair } from 'src/models/exchange-pairs/entities/exchange-pair.entity';
import { UserFile } from 'src/models/user-files/entities/user-file.entity';
import { Invoice } from 'src/models/invoice/entities/invoice.entity';
import { Userplan } from 'src/models/userPlan/entities/userPlan.entity';

@Entity()
export class User extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25, unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', length: 25 })
  lastLogIn: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  // @Column({ type: 'int' })
  // credits: number;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => UserFile, (userFile) => userFile.user)
  files: UserFile;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  @JoinColumn()
  invoice: Invoice;

  @Column({ type: 'varchar', default: '' })
  referredBy: string;

  @Column({ type: 'varchar', default: '' })
  referralCode: string;
}
