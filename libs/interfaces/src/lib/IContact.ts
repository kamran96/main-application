import { IAddress, IBase, IPagination } from '..';

export interface IContact extends IBase {
  name: string;
  email: string;
  contactType: number;
  businessName: string;
  cnic: string;
  phoneNumber: string;
  cellNumber: string;
  faxNumber: string;
  skypeName: string;
  webLink: string;
  creditLimit: number;
  creditLimitBlock: number;
  salesDiscount: number;
  openingBalance: number;
  importedFrom: string;
  paymentDaysLimit: string;
  accountNumber: string;
  importedContactId: string;
  addresses: Array<IAddress>;
  isNewRecord: boolean;
  balance: number;
}

export interface IContactWithResponse {
  message?: string;
  status?: boolean;
  result?: IContact[] | IContact | IContactWithResponse;
  pagination?: IPagination;
}
