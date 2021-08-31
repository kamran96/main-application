import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Attribute } from './attribute.schema';
import { Item } from './item.schema';

@Schema()
export class AttributeValue {
  @Prop({ required: true })
  value: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Item' })
  itemId: Item;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Attribute' })
  attributeId: Attribute;
  @Prop()
  status: number;
}

export const AttributeValueSchema =
  SchemaFactory.createForClass(AttributeValue);
