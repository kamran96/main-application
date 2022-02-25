import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoices } from './invoice.entity';

@Entity()
export class InvoiceItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  invoiceId: number;
  @Column()
  description: string;
  @Column()
  quantity: number;
  @Column()
  itemDiscount: string;
  @Column()
  unitPrice: number;
  @Column()
  accountId: number;
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

  @ManyToOne(() => Invoices, (invoice) => invoice.id)
  @JoinColumn({ name: 'invoiceId', referencedColumnName: 'id' })
  invoice: Invoices;
}
