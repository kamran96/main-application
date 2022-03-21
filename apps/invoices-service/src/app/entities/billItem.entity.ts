import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bills } from './bill.entity';

@Entity()
export class BillItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  billId: number;
  @Column()
  accountId: number;
  @Column()
  description: string;
  @Column()
  quantity: number;
  @Column()
  purchasePrice: number;
  @Column()
  costOfGoodAmount: number;
  @Column()
  sequence: number;
  @Column()
  tax: string;
  @Column()
  total: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  status: number;

  @ManyToOne(() => Bills, (bill) => bill.id)
  @JoinColumn({ name: 'billId', referencedColumnName: 'id' })
  bill: Bills;
}
