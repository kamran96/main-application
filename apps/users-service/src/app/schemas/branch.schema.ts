import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';

@Schema()
export class Branch {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  faxNumber: string;
  @Prop()
  prefix: string;
  @Prop(
    raw({
      description: String,
      city: String,
      country: String,
      postalCode: String,
    })
  )
  address: object;
  @Prop()
  isMain: boolean;
  @Prop()
  status: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;
  @Prop()
  createdById: string;
  @Prop()
  updatedById: string;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.set('toJSON', { virtuals: true });

BranchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
