import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, schema: 'Categroy' })
  parentId: Category;
  @Prop({ default: false })
  isLeaf: boolean;
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

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('attributes', {
  ref: 'Attribute',
  localField: '_id',
  foreignField: 'categoryId',
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });
