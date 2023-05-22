import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { RolePermission } from '../../rolepermissions/entities/role-permission.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Role extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'varchar', length: 5 })
  shortCode: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @OneToMany(() => User, (user) => user.role)
  user: User;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermission: RolePermission;
}
