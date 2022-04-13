import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrders } from './purchaseOrder.entity';

@Entity()
export class PurchaseOrderItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  purchaseOrderId: number;
  @Column()
  accountId: number;
  @Column()
  description: string;
  @Column()
  quantity: number;
  @Column()
  purchasePrice: number;
  @Column()
  costOfGoodAmount: number;
  @Column()
  sequence: number;
  @Column()
  tax: string;
  @Column()
  total: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @Column()
  status: number;

  @ManyToOne(() => PurchaseOrders, (purchaseOrder) => purchaseOrder.id)
  @JoinColumn({ name: 'purchaseOrderId', referencedColumnName: 'id' })
  purchaseOrder: PurchaseOrders;
}
