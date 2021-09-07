import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BillItems } from './billItem.entity';

@Entity()
export class Bills {
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
  directTax: number;
  @Column()
  indirectTax: number;
  @Column()
  isTaxIncluded: number;
  @Column()
  branchId: string;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  isReturn: string;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedBillId: string;
  @Column()
  createdById: string;
  @Column()
  updatedById: string;

  @OneToMany(() => BillItems, (billItem) => billItem.bill)
  billItems: BillItems[];
}
