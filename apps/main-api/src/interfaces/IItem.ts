import { IBase } from './IBase';

export interface Item extends IBase {
  name: string;
  itemType: number;
  barcode: string;
  code: string;
  keyId: number;
  description: string;
  priceId: number;
  branchId: number;
  stock: number;
}
