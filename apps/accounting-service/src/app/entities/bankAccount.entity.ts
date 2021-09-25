import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Accounts } from '.';
import { Banks } from './bank.entity';

@Entity()
export class BankAccounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  accountNumber: string;
  @Column()
  accountType: string;
  @Column()
  accountId: number;
  @Column()
  bankId: number;
  @Column()
  organizationId: string;
  @Column()
  branchId: string;
  @Column()
  createdById: string;
  @Column()
  updatedById: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;

  @OneToOne(() => Banks)
  @JoinColumn()
  bank: Banks;

  @OneToOne(() => Accounts)
  @JoinColumn()
  account: Accounts;
}
