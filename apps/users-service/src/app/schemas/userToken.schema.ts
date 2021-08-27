import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserToken {
  @Prop()
  code: string;
  @Prop()
  userId: string;
  @Prop()
  expiresAt: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
