import {
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionItems } from './TransactionItem.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  amount: number;
  @Column()
  narration: string;
  @Column()
  notes: string;
  @Column()
  ref: string;
  @Column()
  date: Date;
  @Column()
  organizationId: number;
  @Column()
  branchId: number;
  @Column()
  status: number;
  @Column()
  transactionMode: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;
  @OneToMany(
    () => TransactionItems,
    transactionItems => transactionItems.transactionId,
  )
  transactionItems: TransactionItems;
}
