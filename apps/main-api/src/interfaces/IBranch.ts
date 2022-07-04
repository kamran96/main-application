import { IBase } from './index';

export interface IBranch extends IBase {
  name: string;
  address: string;
  phone_no: string;
  fax_no: string;
  organizationId: string;
  isMain: boolean;
}
