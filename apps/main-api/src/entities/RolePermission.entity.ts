import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users, Branches } from './index';

@Entity()
export class RolePermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  permissionId: number;

  @Column()
  organizationId: number;

  @Column()
  hasPermission: boolean;

  @Column()
  status: number;
}
