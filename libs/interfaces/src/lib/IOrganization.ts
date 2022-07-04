import { IBase } from '..';

export interface IOrganization extends IBase {
  name: string;
  email: string;
  niche: string;
  financialEnding: string;
  website: string;
  organizationType: string;
  phoneNumber: string;
  faxNumber: string;
  postalCode: string;
  address: IAddress;
}

export interface IAddress {
  description: string;
  city: string;
  country: string;
  postalAddress?: string;
  town?: string;
  addressType?: number;
  postalCode?: string;
}

export interface IOrganizationResponse {
  message: string;
  status: boolean;
  result: IOrganization[] | IOrganization;
}
