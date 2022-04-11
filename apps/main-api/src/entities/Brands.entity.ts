import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Branches, Accounts } from '.';

@Entity()
export class Brands {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
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
}
