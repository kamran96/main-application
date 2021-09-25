export class PriceDto {
  priceType: number;
  purchasePrice: number;
  salePrice: number;
  tax: string;
  discount: string;
  openingStock: number;
  stock: number;
  tradePrice: number;
  tradeDiscount: number;
  isNewRecord: boolean;
  handlingCost: number;
  unitsInCorton: number;
  item_ids: Array<string>;
}
