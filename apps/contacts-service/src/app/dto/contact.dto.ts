import { IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
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
  openingBalance: string;
  debitAccount: number;
  creditAccount: number;
  importedFrom: string;
  paymentDaysLimit: string;
  accountNumber: string;
  importedContactId: string;
  organizationId: number;
  branchId: number;
  createdById: number;
  updatedById: number;
  addresses: Array<AddressDto>;
  id: string;
  isNewRecord: boolean;
}

export class AddressDto {
  description: string;
  addressType: number;
  city: string;
  town: string;
  country: string;
  postalCode: string;
}

export class ContactIds {
  ids: Array<number>;
}

export class ParamsDto {
  id: string;
}
