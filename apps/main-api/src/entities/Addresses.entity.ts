import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Addresses {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @Column()
  city: string;
  @Column()
  town: string;
  @Column()
  addressType: number;
  @Column()
  postalCode: number;
  @Column()
  contactId: number;
  @Column()
  country: string;
  @Column()
  status: number;
}
