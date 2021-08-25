import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Branch {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  description: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  faxNumber: string;
  @Prop()
  prefix: string;
  @Prop(
    raw({
      city: String,
      country: String,
      postalAddress: String,
    })
  )
  address: object;
  @Prop()
  isMain: boolean;
  @Prop()
  status: number;
  @Prop()
  organizationId: number;
  @Prop()
  createdById: number;
  @Prop()
  updatedById: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
