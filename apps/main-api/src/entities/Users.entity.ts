import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Roles, Branches, Organizations, UserProfiles } from './index';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  roleId: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  theme: string;
  @Column()
  prefix: string;
  @Column()
  terms: boolean;
  @Column()
  marketing: boolean;
  @Column()
  isVerified: boolean;
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

  @OneToOne(
    type => Roles,
    role => role.id,
  )
  @JoinColumn()
  role: Roles;

  @OneToOne(
    type => Branches,
    branch => branch.id,
  )
  @JoinColumn()
  branch: Branches;

  @OneToOne(
    type => Organizations,
    organization => organization.id,
  )
  @JoinColumn()
  organization: Organizations;

  @OneToOne(type => UserProfiles)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  profile: UserProfiles;
}
