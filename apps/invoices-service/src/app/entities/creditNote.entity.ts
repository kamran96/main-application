import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BillItems } from './billItem.entity';
import { CreditNoteItems } from './creditNoteItem.entity';
import { InvoiceItems } from './invoiceItem.entity';

@Entity()
export class CreditNotes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  contactId: string;
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
  currency: string;
  @Column()
  netTotal: number;
  @Column()
  date: string;
  @Column()
  type: string;
  @Column()
  branchId: string;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  createdById: string;
  @Column()
  updatedById: string;

  @OneToMany(
    () => CreditNoteItems,
    (creditNoteItem) => creditNoteItem.creditNote
  )
  creditNoteItems: CreditNoteItems[];
}
