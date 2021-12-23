import { IBase } from './base';
import { ICurrency, IOrganizationType } from './organization';
import { IAddress } from './index';

export interface IAuth {
  access_token?: string;
  users?: IUser;
}

export interface IUser extends IBase {
  id?: number;
  roleId?: number;
  name?: string;
  password?: string;
  branchId?: number;
  organizationId?: number;
  status?: number;
  organization?: IOrganization;
  fax?: string;
  currency?: ICurrency;
  isVerified?: boolean;
  branch?: IBranch;
  role?: IRole;
  profile?: IProfile;
  username?: string;
  email?: string;
}

export interface IOrganization extends IBase {
  id?: number;
  name?: string;
  niche?: string;
  financialEnding?: string;
  status?: number;
  organizationType?: IOrganizationType;

  branches?: IBranch[];
  currency?: ICurrency;
  address?: IAddress;
}

export interface IBranch extends IBase {
  id?: number;
  organizationId?: number;
  name?: string;
  address?: string;
  status?: number;
  phone_no?: number;
  fax_no?: number;
  isMain?: boolean;
}

export interface IRole extends IBase {
  id?: number;
  branchId?: number;
  name?: string;
  status?: number;
}

export interface IProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  country: string;
  attachmentId: number;
  phoneNumber: string;
  landLine: string;
  cnic: string | number;
  website: string;
  location: string;
  bio: string;
  jobTitle: string;
  marketingStatus: null;
  attachment: IAttachment;
  prefix?: string;
}

export interface IAttachment extends IBase {
  id: number;
  name: string;
  mimeType: string;
  fileSize: string;
  path: string;
}

export enum IStatusCode {
  BAD_REQUEST = 404,
  SERVER_SIDE_ERROR = 500,
  SUCCESS = 200,
  IS_UPDATED = 201,
}

export class IResponse {}
