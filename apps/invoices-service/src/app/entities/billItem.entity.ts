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
  invoiceId: number;
  @Column()
  description: string;
  @Column()
  quantity: string;
  @Column()
  itemDiscount: string;
  @Column()
  unitPrice: number;
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