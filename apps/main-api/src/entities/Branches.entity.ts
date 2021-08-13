import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Organizations } from './index';

@Entity()
export class Branches {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  organizationId: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  phone_no: string;
  @Column()
  fax_no: string;
  @Column()
  addressId: number;
  @Column()
  email: string;
  @Column()
  prefix: string;
  @Column()
  isMain: boolean;
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
  @ManyToOne(
    type => Organizations,
    organization => organization.id,
  )
  @JoinColumn()
  organization: Organizations;
}
