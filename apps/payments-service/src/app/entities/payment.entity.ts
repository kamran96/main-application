import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Payments {
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
  comment: string;
  @Column()
  dueDate: string;
  @Column()
  paymentMode: number;
  @Column()
  paymentType: number;
  @Column()
  importedPaymentId: string;
  @Column()
  importedFrom: string;
  @Column()
  entryType: number;
  @Column()
  runningPayment: boolean;
  @Column()
  amount: number;
  @Column()
  date: string;
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
}
