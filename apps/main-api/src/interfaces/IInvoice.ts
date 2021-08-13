import { IBase } from './IBase';

export interface IInvoice extends IBase {
  itemId: number;
  quantity: number;
}
