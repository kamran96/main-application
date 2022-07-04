import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ItemLedger {
  @Prop()
  description: string;
  @Prop()
  itemId: string;
  @Prop(raw({}))
  details: string;
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

export const ItemLedgerSchema = SchemaFactory.createForClass(ItemLedger);

ItemLedgerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ItemLedgerSchema.set('toJSON', { virtuals: true });
