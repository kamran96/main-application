import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IAddress } from '@invyce/interfaces';
import { Currency } from './currency.schema';

@Schema()
export class Organization {
  @Prop()
  name: string;
  @Prop({ default: false })
  isActive: boolean;
  @Prop()
  email: string;
  @Prop()
  niche: string;
  @Prop()
  financialEnding: string;
  @Prop()
  website: string;
  @Prop()
  organizationType: string;
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
      postalAddress: String,
      postalCode: String,
    })
  )
  address: IAddress;
  @Prop()
  attachmentId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Currency' })
  currencyId: Currency;
  @Prop()
  status: number;
  @Prop()
  createdById: string;
  @Prop()
  updatedById: string;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.virtual('branches', {
  ref: 'Branch',
  localField: '_id',
  foreignField: 'organizationId',
});

OrganizationSchema.virtual('currency', {
  ref: 'Currency',
  localField: 'currencyId',
  foreignField: '_id',
  justOne: true,
});

OrganizationSchema.set('toObject', { virtuals: true });
OrganizationSchema.set('toJSON', { virtuals: true });
