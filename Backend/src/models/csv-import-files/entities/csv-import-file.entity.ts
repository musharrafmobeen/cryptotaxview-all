import { TimeStamps } from '../../../common/entities/timestamps.entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CsvImportFile extends TimeStamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  filePath: string;

  @Column({ type: 'varchar' })
  exchange: string;
}
