import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CreditNoteItems } from './creditNoteItem.entity';

@Entity()
export class CreditNotes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  contactId: string;
  @Column()
  invoiceId: number;
  @Column()
  billId: number;
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
  netTotal: number;
  @Column()
  importedCreditNoteId: string;
  @Column()
  importedFrom: string;
  @Column()
  currency: string;
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
