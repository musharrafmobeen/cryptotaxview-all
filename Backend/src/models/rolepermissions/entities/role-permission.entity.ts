import { Action } from '../../actions/entities/action.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  shortName: string;

  @Column({ type: 'varchar', length: 10 })
  shortCode: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @ManyToOne(() => Role, (role) => role.rolePermission)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Action, (action) => action.rolePermission)
  @JoinColumn()
  action: Action;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  permission: Permission;
}
