import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transactions } from './Transaction.entity';

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
  branchId: number;
  @Column()
  description: string;
  @Column()
  transactionId: number;
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
  @ManyToOne(
    () => Transactions,
    transaction => transaction.id,
  )
  transaction: Transactions;
}
