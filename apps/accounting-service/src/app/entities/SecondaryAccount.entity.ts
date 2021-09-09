import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PrimaryAccounts } from '.';

@Entity()
export class SecondaryAccounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  code: string;
  @Column()
  primaryAccountId: number;
  @Column()
  organizationId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;

  @ManyToOne((type) => PrimaryAccounts)
  @JoinColumn({ name: 'primaryAccountId', referencedColumnName: 'id' })
  primaryAccount: PrimaryAccounts;
}
