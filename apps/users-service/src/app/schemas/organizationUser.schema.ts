import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { User } from './user.schema';

@Schema()
export class OrganizationUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop()
  status: number;
}

export const OrganizationUserSchema =
  SchemaFactory.createForClass(OrganizationUser);
