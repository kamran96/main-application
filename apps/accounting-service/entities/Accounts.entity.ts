import { join } from 'path';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { PrimaryAccounts } from './PrimaryAccount.entity';
import { SecondaryAccounts } from './SecondaryAccount.entity';

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  secondaryAccountId: number;
  @Column()
  primaryAccountId: number;
  @Column()
  description: string;
  @Column()
  code: string;
  @Column()
  isSystemAccount: boolean;
  @Column()
  taxRate: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedAccountId: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;

  @ManyToOne(type => SecondaryAccounts)
  @JoinColumn({ name: 'secondaryAccountId', referencedColumnName: 'id' })
  secondaryAccount: SecondaryAccounts;

  @ManyToOne(type => PrimaryAccounts)
  @JoinColumn({ name: 'secondaryAccountId', referencedColumnName: 'id' })
  primaryAccount: PrimaryAccounts;
}
