import { Request } from 'express';

export interface IRequest extends Request {
  user: IBaseUser;
}

export interface IBaseUser {
  username: string;
  email: string;
  password?: string;
  _id: string;
  id: string;
  status: number;
  organizationId: string;
  profile?: Profile;
  branchId?: string;
  roleId?: string;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  fullName: string;
  phoneNumber: string;
  prefix: string;
  cnic: string;
  marketingStatus: number;
  country: string;
  website: string;
  location: string;
  bio: string;
  jobTitle: string;
  attachmentId: string;
  status: number;
}

export interface IBase {
  id: string | number;
  status: number;
  organizationId: string;
  branchId?: string;
  roleId?: string;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  total: number;
  page_size: number;
  page_no: number;
  sort_column?: string;
  sort_order?: string;
  next?: number;
  prev?: number;
  total_pages: number;
}

export class IPage {
  page_size: string;
  page_no: string;
  invoice_type?: string;
  status?: number;
  filters?: string;
  purpose?: string;
  query?: string;
  type?: string;
  sort?: string;
  paymentType?: number;
  parentId?: string;
}
