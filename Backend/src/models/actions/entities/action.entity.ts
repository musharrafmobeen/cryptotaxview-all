import { RolePermission } from '../../rolepermissions/entities/role-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column('simple-array')
  actions: string[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.action)
  rolePermission: RolePermission;
}
