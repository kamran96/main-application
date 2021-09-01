import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserCodes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  code: string;
  @Column()
  expiresAt: string;
  @Column()
  userId: number;
}
