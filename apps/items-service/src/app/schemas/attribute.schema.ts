import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from './category.schema';

@Schema()
export class Attribute {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop()
  valueType: string;
  @Prop(raw({}))
  values: object;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Category' })
  categoryId: Category;
  @Prop()
  status: number;
  @Prop()
  organizationId: number;
  @Prop()
  branchId: number;
  @Prop()
  createdById: number;
  @Prop()
  updatedById: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);

AttributeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

AttributeSchema.set('toJSON', { virtuals: true });
