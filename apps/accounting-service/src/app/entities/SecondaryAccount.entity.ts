import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { PrimaryAccounts } from '.';

@Entity()
export class SecondaryAccounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  code: string;
  @Column()
  primaryAccountId: number;
  @Column()
  organizationId: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: string;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: string;

  @ManyToOne(() => PrimaryAccounts)
  @JoinColumn({ name: 'primaryAccountId', referencedColumnName: 'id' })
  primaryAccount: PrimaryAccounts;
}
