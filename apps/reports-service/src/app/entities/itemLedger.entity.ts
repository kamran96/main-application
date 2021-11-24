import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ItemLedgers {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  itemId: string;
  @Column()
  invoiceId: number;
  @Column()
  billId: number;
  @Column()
  creditNoteId: number;
  @Column()
  description: string;
  @Column()
  quantity: number;
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
