import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PrimaryAccounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: string;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: string;
}
