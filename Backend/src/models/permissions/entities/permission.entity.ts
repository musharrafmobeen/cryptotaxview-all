import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { RolePermission } from '../../rolepermissions/entities/role-permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Permission extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  shortCode: string;

  @Column({ type: 'int' })
  level: number;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermission: RolePermission;
}
