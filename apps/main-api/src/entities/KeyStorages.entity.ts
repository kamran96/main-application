import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class KeyStorages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  key: string;
  @Column()
  value: string;
  @Column()
  status: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
}
