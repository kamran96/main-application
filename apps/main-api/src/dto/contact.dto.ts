export class ContactDto {
  id: number;
  businessName: string;
  accountName: string;
  email: string;
  name: string;
  cnic: string;
  phoneNumber: string;
  cellNumber: string;
  faxNumber: string;
  skypeNumber: string;
  isNewRecord: boolean;
  webLink: string;
  creditLimit: number;
  creditLimitBlock: number;
  salesDiscount: string;
  paymentDaysLimit: string;
  status: number;
  addresses: Array<any>;
}
export class ContactIdDto {
  ids: Array<number>;
}

export class ContactUsDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  city: string;
  country: string;
  message: string;
}
