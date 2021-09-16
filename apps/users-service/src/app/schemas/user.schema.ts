import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Branch } from './branch.schema';
import { Organization } from './organization.schema';
import { Role } from './role.schema';

@Schema()
export class User {
  @Prop()
  username: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  theme: string;
  @Prop()
  terms: boolean;
  @Prop()
  marketing: boolean;
  @Prop()
  isVerified: boolean;
  @Prop(
    raw({
      fullName: String,
      phoneNumber: String,
      prefix: String,
      cnic: String,
      marketingStatus: Number,
      country: String,
      website: String,
      location: String,
      bio: String,
      jobTitle: String,
      attachmentId: Number,
      status: String,
    })
  )
  profile: object;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  roleId: Role;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branchId: Branch;
  @Prop()
  status: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organizationId',
  foreignField: '_id',
  justOne: true,
});

UserSchema.virtual('branch', {
  ref: 'Branch',
  localField: 'branchId',
  foreignField: '_id',
  justOne: true,
});

UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
