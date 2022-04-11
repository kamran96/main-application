import { Purchase } from 'aws-sdk/clients/ec2';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Branches, Contacts, PurchaseItems } from '.';

@Entity()
export class Purchases {
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
  invoiceType: string;
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
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedBillId: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;

  @OneToOne((type) => Branches, (branch) => branch.id)
  @JoinColumn()
  branch: Branches;

  @OneToOne((type) => Contacts, (contact) => contact.id)
  @JoinColumn()
  contact: Contacts;

  @OneToMany(
    (type) => PurchaseItems,
    (purchase_items) => purchase_items.purchaseId
  )
  @JoinColumn()
  purchase_items: PurchaseItems;
}
