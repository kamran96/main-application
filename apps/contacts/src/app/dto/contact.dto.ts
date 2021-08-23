import { IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsNotEmpty()
  name: string;
  email: string;
  type: number;
  businessName: string;
  cnic: string;
  phoneNumber: string;
  cellNumber: string;
  faxNumber: string;
  stypeName: string;
  webLink: string;
  creditLimit: number;
  creditLimitBlock: number;
  salesDiscount: number;
  openingBalance: number;
  importedFrom: string;
  importedContactId: string;
  organizationId: number;
  branchId: number;
  createdById: number;
  updatedById: number;
  addresses: Array<any>;
  id: number;
  isNewRecord: boolean;
}

export class ContactIds {
  ids: Array<number>;
}
