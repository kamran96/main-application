import { Purchase } from 'aws-sdk/clients/ec2';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Purchases, Items } from '.';

@Entity()
export class PurchaseItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: number;
  @Column()
  purchaseId: number;
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
  // @Column()
  // createdBy: number;

  @ManyToOne((type) => Purchases, (purchase) => purchase.id)
  @JoinColumn()
  purchase: Purchase;

  @ManyToOne((type) => Items, (item) => item.id)
  @JoinColumn()
  item: Items;
}
