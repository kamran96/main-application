import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Attachment {
  @Prop({ required: true })
  name: string;
  @Prop()
  mimeType: string;
  @Prop()
  fileSize: string;
  @Prop()
  path: string;
  @Prop()
  createdById: string;
  @Prop({ required: true })
  updatedById: string;
  @Prop()
  status: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: string;
  @Prop({ type: Date, default: Date.now })
  updatedAt: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
AttachmentSchema.set('toJSON', { virtuals: true });

AttachmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
