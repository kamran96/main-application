import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreditNotes } from './creditNote.entity';

@Entity()
export class CreditNoteItems {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  accountId: number;
  @Column()
  creditNoteId: number;
  @Column()
  description: string;
  @Column()
  quantity: number;
  @Column()
  itemDiscount: string;
  @Column()
  unitPrice: string;
  @Column()
  purchasePrice: string;
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
