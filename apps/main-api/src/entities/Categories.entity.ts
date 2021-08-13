import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Branches, Brands } from '.';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  brandId: number;
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

  @OneToOne(
    type => Branches,
    branch => branch.id,
  )
  @JoinColumn()
  branch: Branches;

  @ManyToOne(
    type => Brands,
    brand => brand.id,
  )
  @JoinColumn()
  brand: Brands;
}
