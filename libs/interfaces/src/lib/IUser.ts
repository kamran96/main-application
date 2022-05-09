import { IBase, IPagination } from '..';
import { IBranch } from './IBranch';
import { IOrganization } from './IOrganization';
import { IRole } from './IRbac';

export interface IUser extends IBase {
  username: string;
  email: string;
  password?: string;
  terms: boolean;
  marketing: boolean;
  theme: string;
  isVerified: boolean;
  role?: IRole;
  organization?: IOrganization;
  branch?: IBranch;
  profile?: IProfile;
}

export interface IProfile {
  fullName: string;
  phoneNumber: string;
  prefix: string;
  cnic: string;
  marketingStatus: string;
  country: string;
  website: string;
  location: string;
  bio: string;
  jobTitle: string;
  attachmentId: string;
  status: string;
}

export interface IUserWithResponse {
  message?: string;
  status?: boolean | number;
  result?: IUser | IUser[];
  pagination?: IPagination;
}

export interface IUserWithResponseAndStatus {
  result: IUserAccessControlResponse;
}

export interface ICheckUser {
  user: IUser;
  token: string;
}

export interface IUserCheck {
  message: string;
  status: boolean;
  result: IUser;
}

export interface IUserAccessControlResponse {
  message?: string;
  statusCode?: number;
  user?: IUser;
}

export interface IUserChangePassword {
  username?: string;
  password?: string;
  status: 1;
  organizationId: string;
  roleId: string;
}

export interface IVerifyOtp {
  status: boolean;
}
