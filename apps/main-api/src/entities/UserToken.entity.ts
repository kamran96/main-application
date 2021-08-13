import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Organizations, Users } from './index';

@Entity()
export class UsersToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  organizationId: number;

  @Column()
  expiresAt: string;

  @Column()
  token: string;

  @Column()
  marketingStatus: string;

  @OneToOne(
    type => Users,
    user => user.id,
  )
  @JoinColumn()
  user: Users;

  @OneToOne(
    type => Organizations,
    org => org.id,
  )
  @JoinColumn()
  org: Organizations;
}
