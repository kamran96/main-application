export class PriceDto {
  priceType: number;
  purchasePrice: number;
  salePrice: number;
  tradePrice: number;
  tradeDiscount: number;
  handlingCost: number;
  priceUnit: number;
  unitsInCarton: number;
  openingStock: number;
  targetAccount: number;
  item_ids: Array<number>;
}
