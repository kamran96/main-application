import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PurchaseOrderItems } from './purchaseOrderItem.entity';

@Entity()
export class PurchaseOrders {
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
  adjustment: number;
  @Column()
  grossTotal: number;
  @Column()
  currency: string;
  @Column()
  netTotal: number;
  @Column()
  date: string;
  @Column()
  comment: string;
  @Column()
  invoiceType: string;
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
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedPurchaseOrderId: string;
  @Column()
  createdById: string;
  @Column()
  updatedById: string;

  @OneToMany(
    () => PurchaseOrderItems,
    (purchaseOrderItem) => purchaseOrderItem.purchaseOrder
  )
  purchaseOrderItems: PurchaseOrderItems[];
}
