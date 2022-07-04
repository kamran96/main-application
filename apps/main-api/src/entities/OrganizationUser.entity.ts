import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OrganizationUsers {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  organizationId: number;
  @Column()
  userId: number;
  @Column()
  roleId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
}
