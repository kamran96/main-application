import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { PrimaryAccounts } from './PrimaryAccount.entity';
import { SecondaryAccounts } from './SecondaryAccount.entity';
import { TransactionItems } from './TransactionItem.entity';

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
  branchId: string;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedAccountId: string;
  @Column()
  createdById: string;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: string;

  @ManyToOne(() => SecondaryAccounts)
  @JoinColumn({ name: 'secondaryAccountId', referencedColumnName: 'id' })
  secondaryAccount: SecondaryAccounts;

  // @ManyToOne(() => PrimaryAccounts)
  // @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  // primaryAccount: PrimaryAccounts;

  @ManyToOne(() => PrimaryAccounts, (primaryAccount) => primaryAccount.id)
  primaryAccount: PrimaryAccounts;

  @OneToOne(() => TransactionItems)
  @JoinColumn({ name: 'id' })
  transactionItems: TransactionItems;
}
