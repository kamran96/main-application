import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Addresses } from './Addresses.entity';
import { Branches } from './index';

@Entity()
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  businessName: string;
  @Column()
  accountNumber: string;
  @Column()
  email: string;
  @Column()
  name: string;
  @Column()
  cellNumber: string;
  @Column()
  phoneNumber: string;
  @Column()
  contactType: number;
  @Column()
  cnic: string;
  @Column()
  faxNumber: string;
  @Column()
  skypeName: string;
  @Column()
  webLink: string;
  @Column()
  creditLimit: number;
  @Column()
  creditLimitBlock: number;
  @Column()
  salesDiscount: number;
  @Column()
  paymentDaysLimit: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  addressId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  importedFrom: string;
  @Column()
  importedContactId: string;
  @Column()
  createdById: number;
  @Column()
  updatedAt: string;
  @Column()
  updatedById: number;
  @OneToOne((type) => Branches, (branch) => branch.id)
  @JoinColumn()
  branch: Branches;
  @OneToOne((type) => Addresses, (address) => address.id)
  @JoinColumn()
  address: Addresses;
}
