import { IBase } from './IBase';

export interface IAccount extends IBase {
  name: string;
  code: number | string;
  balance: number;
  secondaryAccountId: number;
  taxRate: number;
}
