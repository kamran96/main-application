import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  organizationId: string;
  @Column()
  branchId: string;
  @Column()
  status: number;
  @Column()
  transactionMode: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: string;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: string;
  @OneToMany(
    () => TransactionItems,
    (transactionItems) => transactionItems.transaction
  )
  transactionItems: TransactionItems[];
}
