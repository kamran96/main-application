import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Branches, Contacts } from '.';

@Entity()
export class Invoices {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  contactId: number;
  @Column()
  reference: string;
  @Column()
  issueDate: string;
  @Column()
  dueDate: string;
  @Column()
  invoiceNumber: string;
  @Column()
  discount: number;
  @Column()
  grossTotal: number;
  @Column()
  currency: number;
  @Column()
  netTotal: number;
  @Column()
  date: string;
  @Column()
  invoiceType: string; // its wether this invoice is sale/purchase/purchase_order/Sale_order invoice
  @Column()
  directTax: number;
  @Column()
  indirectTax: number;
  @Column()
  isTaxIncluded: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  status: number;
  @Column()
  isReturn: boolean;
  @Column()
  comment: boolean;
  @Column()
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedInvoiceId: string;
  @Column()
  createdById: number;

  @OneToOne(
    type => Branches,
    branch => branch.id,
  )
  @JoinColumn()
  branch: Branches;

  @OneToOne(
    type => Contacts,
    contact => contact.id,
  )
  @JoinColumn()
  contact: Contacts;

  // @OneToMany(type => InvoiceItems)
  // @JoinColumn({ name: 'id', referencedColumnName: 'invoiceId' })
  // invoice: InvoiceItems;
}
