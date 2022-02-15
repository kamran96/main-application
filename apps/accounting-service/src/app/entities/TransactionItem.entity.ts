import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transactions } from './Transaction.entity';
import { Accounts } from './Accounts.entity';

@Entity()
export class TransactionItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  amount: number;
  @Column()
  transactionType: number;
  @Column()
  accountId: number;
  @Column()
  branchId: string;
  @Column()
  description: string;
  @Column()
  transactionId: number;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: string;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: string;

  @ManyToOne(() => Transactions, (transaction) => transaction.id)
  transaction: Transactions;

  @OneToOne(() => Accounts)
  @JoinColumn()
  account: Accounts;
}
