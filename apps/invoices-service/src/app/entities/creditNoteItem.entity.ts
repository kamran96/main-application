import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bills } from './bill.entity';
import { CreditNotes } from './creditNote.entity';
import { Invoices } from './invoice.entity';

@Entity()
export class CreditNoteItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  creditNoteId: number;
  @Column()
  description: string;
  @Column()
  quantity: string;
  @Column()
  itemDiscount: string;
  @Column()
  unitPrice: number;
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

  @ManyToOne(() => CreditNotes, (creditNote) => creditNote.id)
  @JoinColumn({ name: 'creditNoteId', referencedColumnName: 'id' })
  creditNote: CreditNotes;
}
