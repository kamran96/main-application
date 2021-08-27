import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';
import { Permission } from './permission.schema';
import { Organization } from './organization.schema';

@Schema()
export class RolePermission {
  @Prop()
  hasPermission: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  roleId: Role;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' })
  permissionId: Permission;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
