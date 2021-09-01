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
