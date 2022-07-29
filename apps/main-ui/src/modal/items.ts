import { ICategory } from './categories';
import { IBase, IBaseRequest, IBaseResponse } from './base';

export enum ITEM_TYPE {
  PRODUCT = 1,
  SERVICE = 2,
}

export interface Iitems extends IBase {
  name?: string;
  barcode?: string;
  code?: string;
  keyId?: number;
  description?: string;
  priceId?: number;
  status?: number;
  branchId?: number;
}

export interface IItemsResponse extends IBaseRequest {
  result?: IItemsResult[];
}

export interface IItemViewResult extends IBaseRequest {
  result?: IItemsResult;
}

export interface IItemsResult extends IBase {
  id?: number;
  name?: string;
  barcode?: string;
  code?: string;
  keyId?: number;
  description?: string;
  priceId?: number;
  branchId?: number;
  productType?: string;
  itemType?: number | string;
  key?: number | string;
  price?: IPrice;
  categoryId?: number;
  category: ICategory;
  stock?: number;
  hasInventory?: boolean;
  totalBillsAmount: number;
  totalInvoicesAmount: number;
}

export class ITemsResult extends IBaseResponse {
  id?: number;
  name?: string;
  barcode?: string;
  code?: string;
  keyId?: number;
  description?: string;
  priceId?: number;
  branchId?: number;
  productType?: string;
  itemType?: number | string;
  key?: number | string;
  price?: IPrice;
  stock?: number;
  openingStock?: number;
  categoryId?: number;
  category?: ICategory;

  getStock() {
    return this.stock;
  }
}

export interface IPrice {
  handlingCost: number;
  id: number;
  priceType: number;
  priceUnit: number;
  purchasePrice: number;
  salePrice: number;
  tradeDiscount: number;
  tradePrice: number;
  unitsInCarton: number;
  tax: string;
  discount: string;
  priceId?: number;
}

export interface IItemViewResponse extends IBaseRequest {
  result: IItemDetail;
}
export interface IItemDetail {
  addeddate: string;
  description: string;
  id: string;
  name: string;
  purchaseamount: number;
  quantitystock: string;
  saleamount: string;
  salecount: string;
  category_name: string;
}

export interface ITopRunningItems {
  category_name: string;
  id: number;
  item_name: string;
  purchase_price: number;
  sale_date: number;
  sale_price: number;
  status: number;
  total: number;
}
