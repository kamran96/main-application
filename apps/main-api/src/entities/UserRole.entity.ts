import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  branchId: number;
  @Column()
  organizationId: number;
  @Column()
  roleId: number;
  @Column()
  userId: number;
  @Column()
  status: number;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
}
