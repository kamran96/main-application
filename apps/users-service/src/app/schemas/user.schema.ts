import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { IProfile } from '@invyce/interfaces';
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
  @Prop({ default: false })
  twoFactorEnabled: boolean;
  @Prop({ default: false })
  isVerified: boolean;
  @Prop({ default: false })
  rememberMe: boolean;
  @Prop()
  terms: boolean;
  @Prop()
  marketing: boolean;
  @Prop(
    raw({
      fullName: String,
      email: String,
      phoneNumber: String,
      prefix: String,
      cnic: String,
      marketingStatus: Number,
      country: String,
      website: String,
      location: String,
      bio: String,
      jobTitle: String,
      attachmentId: String,
      status: Number,
    })
  )
  profile: IProfile;
  @Prop()
  loginWith: string;
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
UserSchema.plugin(mongoosePaginate);

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
