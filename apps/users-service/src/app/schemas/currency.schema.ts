import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Currency {
  @Prop()
  name: string;
  @Prop()
  code: string;
  @Prop()
  symbol: string;
  @Prop()
  symbolNative: string;
  @Prop()
  decimalDigits: number;
  @Prop()
  rounding: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
