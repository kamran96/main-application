import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Permission {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  module: string;
  @Prop()
  status: number;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
