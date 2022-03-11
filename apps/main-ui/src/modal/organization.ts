import { IBase, IBaseRequest } from './base';

export interface IOrganizationResult extends IBaseRequest {
  result: IOrganizations[];
}

export interface IOrganizations extends IBase {
  name: string;
  permanentAddress: string;
  residentialAddress: string;
  niche: string;
  financialEnding: string;
  branches: IBranch[];
  currency: ICurrency;
}

export interface ICurrency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  symbolNative?: string;
}

export interface IBranch extends IBase {
  name: string;
  address: string;
}

export enum IOrganizationType {
  ENTERPRISE = 'EN', // For International Enterprise businesses
  SAAS = 'SAAS', // FOR ALL TYPE OF INTERNATIONAL BUSINESSES
  LOCAL_ENTERPRISES = 'LOC_EN', // FOR LOCAL BUSINESSES
}
