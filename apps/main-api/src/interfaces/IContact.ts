import { IBase } from './IBase';

export interface IContact extends IBase {
  businessName: string;
  accountName: string;
  email: string;
  name: string;
  cnic: string;
  phoneNumber: string;
  cellNumber: string;
  faxNumber: string;
  skypeNumber: string;
  webLink: string;
  creditLimit: number;
  creditLimitBlock: number;
  salesDiscount: string;
  paymentDaysLimit: string;
  status: number;
}
