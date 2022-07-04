import { IBase } from './IBase';

export interface IOrganization extends IBase {
  name: string;
  permanentAddress: string;
  niche: string;
  residentialAddress: string;
  financialEnding: string;
}
