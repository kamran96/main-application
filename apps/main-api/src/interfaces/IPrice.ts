import { IBase } from './IBase';

export interface Price extends IBase {
  priceType: number;
  purchasePrice: number;
  salePrice: number;
  tradePrice: number;
  tradeDiscount: number;
  handlingCost: number;
  priceUnit: number;
  unitsInCarton: number;
}
