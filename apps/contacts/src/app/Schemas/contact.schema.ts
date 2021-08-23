import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Contact {
  @Prop({ required: true })
  name: string;
  @Prop()
  email: string;
  @Prop()
  type: number;
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
  importedFrom: string;
  @Prop()
  importedContactId: string;
  @Prop()
  organizationId: number;
  @Prop()
  branchId: number;
  @Prop({ required: true })
  createdById: number;
  @Prop({ required: true })
  updatedById: number;
  @Prop()
  status: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
