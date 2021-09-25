import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Attribute, AttributeSchema } from './attribute.schema';
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

AttributeValueSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

AttributeValueSchema.set('toJSON', { virtuals: true });
