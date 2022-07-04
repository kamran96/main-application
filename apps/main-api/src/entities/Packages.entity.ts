import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Packages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  details: string;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
}
