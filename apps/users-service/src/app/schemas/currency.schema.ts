import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Currrency {
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

export const CurrencySchema = SchemaFactory.createForClass(Currrency);
