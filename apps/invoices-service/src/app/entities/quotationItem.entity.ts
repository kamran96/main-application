import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quotations } from './quotation.entity';

@Entity()
export class QuotationItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  quotationId: number;
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

  @ManyToOne(() => Quotations, (quotation) => quotation.id)
  @JoinColumn({ name: 'quotationId', referencedColumnName: 'id' })
  quotation: Quotations;
}
