import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RolePermissions } from './RolePermission.entity';

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
  organizationId: number;
  @Column()
  branchId: number;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
}
