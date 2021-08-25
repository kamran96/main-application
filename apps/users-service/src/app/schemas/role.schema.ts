import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  level: number;
  @Prop()
  parentId: number;
  @Prop()
  status: number;
  @Prop()
  organizationId: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
