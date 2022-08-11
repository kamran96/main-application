import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Item } from './item.schema';

@Schema()
export class Price {
  @Prop()
  purchasePrice: number;
  @Prop()
  salePrice: number;
  @Prop()
  tradePrice: number;
  @Prop()
  tradeDiscount: number;
  @Prop()
  handlingCost: number;
  @Prop()
  priceUnit: number;
  @Prop()
  unitsInCorton: number;
  @Prop()
  priceType: number;
  @Prop()
  status: number;
  @Prop()
  tax: string;
  @Prop()
  discount: string;
  @Prop()
  transactionId: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Item' })
  itemId: Item;
  @Prop()
  initialPurchasePrice: number;
  @Prop({ default: false })
  hasBills: boolean;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
