import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  comment: string;
  @Column()
  amount: number;
  @Column()
  dueDate: string;
  @Column()
  paymentType: number;
  @Column()
  paymentMode: number;
  @Column()
  contactId: number;
  @Column()
  invoiceId: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  bankId: number;
  @Column()
  transactionId: number;
  @Column()
  invoices: string;
  @Column()
  purchaseId: number;
  @Column()
  date: string;
  @Column()
  importedPaymentId: string;
  @Column()
  importedFrom: string;
  @Column()
  entryType: number;
  @Column()
  runningPayment: boolean;
  @Column()
  reference: string;
  @Column()
  status: number;
}
