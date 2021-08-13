import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Permissions } from './Permission.entity';
import { RolePermissions } from './RolePermission.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  description: number;
  @Column()
  name: string;
  @Column()
  parentId: number;
  @Column()
  level: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;

  @OneToOne(type => Roles)
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  role: Roles;
}
