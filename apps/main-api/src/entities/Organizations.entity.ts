import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Organizations {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  permanentAddress: string;
  @Column()
  niche: string;
  @Column()
  organizationType: string;
  @Column()
  residentialAddress: string;
  @Column()
  financialEnding: string;
  @Column()
  status: number;
  @Column()
  email: string;
  @Column()
  phoneNumber: string;
  @Column()
  faxNumber: string;
  @Column()
  prefix: string;
  @Column()
  website: string;
  @Column()
  attachmentId: number;
  @Column()
  addressId: number;
  @Column()
  packageId: number;
  @Column()
  currencyId: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
}
