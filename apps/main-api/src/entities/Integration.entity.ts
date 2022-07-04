import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Integrations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  token: string;

  @Column()
  data: string;
  @Column()
  enabled: boolean;
  @Column()
  status: number;
  @Column()
  organizationId: number;
  @Column()
  tenantId: string;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
  @Column()
  createdAt: number;
  @Column()
  updatedAt: number;
}
