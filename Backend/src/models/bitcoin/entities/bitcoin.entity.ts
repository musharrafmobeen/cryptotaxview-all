import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bitcoin {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar' })
  hash: string;
}
