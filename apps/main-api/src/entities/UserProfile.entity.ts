import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Attachments } from './Attachment.entity';
import { Users } from './index';

@Entity()
export class UserProfiles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  fullName: string;
  @Column()
  email: string;
  @Column()
  country: string;
  @Column()
  attachmentId: number;
  @Column()
  phoneNumber: string;
  @Column()
  landLine: string;
  @Column()
  cnic: string;
  @Column()
  website: string;
  @Column()
  location: string;
  @Column()
  bio: string;
  @Column()
  jobTitle: string;
  @Column()
  marketingStatus: string;

  @OneToOne((type) => Users, (user) => user.id)
  @JoinColumn()
  user: Users;

  @OneToOne((type) => Attachments, (attachment) => attachment.id)
  @JoinColumn()
  attachment: Attachments;
}
