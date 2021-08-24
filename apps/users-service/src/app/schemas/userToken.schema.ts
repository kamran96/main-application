import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserToken {
  @Prop()
  code: string;
  @Prop()
  userId: number;
  @Prop()
  expiresAt: Date;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
