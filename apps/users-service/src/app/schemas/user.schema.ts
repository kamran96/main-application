import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  @Prop()
  organizationId: number;
  @Prop()
  roleId: number;
  @Prop()
  branchId: number;
  @Prop()
  status: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
