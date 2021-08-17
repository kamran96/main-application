import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  module: string;
  @Column()
  status: number;
  @Column()
  organizationId: number;
  @Column()
  branchId: number;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
}
