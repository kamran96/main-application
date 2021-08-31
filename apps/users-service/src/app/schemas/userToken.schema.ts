import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserToken {
  @Prop()
  code: string;
  @Prop()
  userId: string;
  @Prop()
  expiresAt: string;
  @Prop()
  brower: string;
  @Prop()
  ipAddress: string;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
