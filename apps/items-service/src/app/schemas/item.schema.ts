import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Category } from './category.schema';

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop()
  code: string;
  @Prop()
  barcode: string;
  @Prop()
  itemType: number;
  @Prop()
  isActive: boolean;
  @Prop()
  stock: number;
  @Prop()
  openingStock: number;
  @Prop()
  minimumStock: number;
  @Prop()
  hasCategory: boolean;
  @Prop()
  hasInventory: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Category' })
  categoryId: Category;
  @Prop()
  status: number;
  @Prop()
  organizationId: string;
  @Prop()
  branchId: string;
  @Prop()
  createdById: string;
  @Prop()
  updatedById: string;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.plugin(mongoosePaginate);

ItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ItemSchema.virtual('price', {
  ref: 'Price',
  localField: '_id',
  foreignField: 'itemId',
  justOne: true,
});
ItemSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});
ItemSchema.virtual('attribute_values', {
  ref: 'AttributeValue',
  localField: '_id',
  foreignField: 'itemId',
  // hasMany: true,
});

ItemSchema.set('toObject', { virtuals: true });
ItemSchema.set('toJSON', { virtuals: true });
