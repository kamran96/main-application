import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Accounts } from '.';

@Entity()
export class PrimaryAccounts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
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

  @OneToMany(() => Accounts, (primaryAccount) => primaryAccount.primaryAccount)
  primaryAccount: Accounts[];
}
