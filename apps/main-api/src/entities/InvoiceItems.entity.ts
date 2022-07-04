import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Invoices, Items } from '.';

@Entity()
export class InvoiceItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: number;
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
  tax: string;
  @Column()
  total: number;
  @Column()
  organizationId: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: number;

  @ManyToOne((type) => Invoices, (invoice) => invoice.id)
  @JoinColumn()
  invoice: Invoices;

  @OneToMany((type) => Items, (item) => item.id)
  @JoinColumn()
  item: Items;
}
