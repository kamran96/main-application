import { IBase } from '..';

export interface IPrice extends IBase {
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
  priceUnit: number;
  itemId: string;
}

export interface IPriceWithResponse {
  message: string;
  status: boolean;
  result: IPrice[] | IPrice;
}
