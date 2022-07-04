import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Branches, Accounts } from '.';

@Entity()
export class AccountGroup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  accountId: number;
  @Column()
  groupName: string;
  @Column()
  branchId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;

  @OneToOne((type) => Branches, (branch) => branch.id)
  @JoinColumn()
  branch: Branches;

  @OneToOne((type) => Accounts, (account) => account.id)
  @JoinColumn()
  account: Accounts;
}
