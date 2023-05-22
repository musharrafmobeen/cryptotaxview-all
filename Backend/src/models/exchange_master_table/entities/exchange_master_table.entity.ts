import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ExchangeMasterTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  name: string;

  @Column({ type: 'bool' })
  csvRowToColTransformationRequired: Boolean;

  @Column({ type: 'jsonb' })
  csvSplitIdentifiers: JSON;

  @Column({ type: 'jsonb' })
  csvColumnMapping: JSON;

  @Column({ type: 'jsonb' })
  csvColumnJoinMapping: JSON;

  @Column({ type: 'jsonb' })
  csvFormulas: JSON;
}
