import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';

@Schema()
export class Role {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  level: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  parentId: Role;
  @Prop()
  status: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
