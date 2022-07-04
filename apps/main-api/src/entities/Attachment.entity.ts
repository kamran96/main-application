import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attachments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  mimeType: string;
  @Column()
  fileSize: string;
  @Column()
  path: string;
  @Column()
  createdById: number;
  @Column()
  updatedById: number;
  @Column()
  status: number;
  @Column()
  created_at: string;
  @Column()
  updated_at: string;
}
