import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
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
  type: number;
  @Prop()
  isActive: boolean;
  @Prop()
  stock: number;
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

export const ItemSchema = SchemaFactory.createForClass(Item);
