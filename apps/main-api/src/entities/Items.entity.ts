import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Branches, KeyStorages, Prices } from '.';

@Entity()
export class Items {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  barcode: string;
  @Column()
  keyId: number;
  @Column()
  description: string;
  @Column()
  priceId: number;
  @Column()
  code: string;
  @Column()
  stock: number;
  @Column()
  openingStock: number;
  @Column()
  isActive: number;
  @Column()
  hasCategory: boolean;
  @Column()
  hasInventory: boolean;
  @Column()
  itemType: number;
  @Column()
  status: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  accountId: number;
  @Column()
  minimumStock: number;
  @Column()
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedItemId: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;

  @OneToOne((type) => Branches, (branch) => branch.id)
  @JoinColumn()
  branch: Branches;

  @OneToMany((type) => KeyStorages, (key) => key.id)
  @JoinColumn()
  key: KeyStorages;

  @OneToOne((type) => Prices, (price) => price.id)
  @JoinColumn()
  price: Prices;
}
