import { IBase } from '..';
import { IAddress } from './IOrganization';

export interface IBranch extends IBase {
  name: string;
  email: string;
  niche: string;
  phoneNumber: string;
  faxNumber: string;
  prefix: string;
  address: IAddress;
  isMain: boolean;
}

export interface IBranchDetail {
  message: string;
  result: IBranch[] | IBranch;
}

export interface IBranchParams {
  id: number;
}
