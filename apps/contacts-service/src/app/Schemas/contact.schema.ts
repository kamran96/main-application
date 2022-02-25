import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema()
export class Contact {
  @Prop({ required: true })
  name: string;
  @Prop()
  email: string;
  @Prop()
  contactType: number;
  @Prop()
  businessName: string;
  @Prop()
  cnic: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  cellNumber: string;
  @Prop()
  faxNumber: string;
  @Prop()
  skypeName: string;
  @Prop()
  webLink: string;
  @Prop()
  creditLimit: number;
  @Prop()
  creditLimitBlock: number;
  @Prop()
  salesDiscount: number;
  @Prop()
  addresses: string[];
  @Prop()
  openingBalance: number;
  @Prop()
  transactionId: number;
  @Prop()
  balance: number;
  @Prop()
  importedFrom: string;
  @Prop({ default: false })
  hasOpeningBalance: boolean;
  @Prop()
  importedContactId: string;
  @Prop()
  paymentDaysLimit: string;
  @Prop()
  accountNumber: string;
  @Prop()
  organizationId: string;
  @Prop()
  branchId: string;
  @Prop({ required: true })
  createdById: string;
  @Prop({ required: true })
  updatedById: string;
  @Prop()
  status: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.plugin(mongoosePaginate);

ContactSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ContactSchema.set('toObject', { virtuals: true });
ContactSchema.set('toJSON', { virtuals: true });
