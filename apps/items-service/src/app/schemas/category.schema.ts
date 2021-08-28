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
  @Prop()
  attachmentId: number;
  @Prop()
  isLeaf: boolean;
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

export const CategorySchema = SchemaFactory.createForClass(Category);
