import { IBaseRequest } from './base';
export interface IPermissionsResponsse extends IBaseRequest {
  result: IPermission[];
}

export interface IPermission {
  branchId: number;
  createdAt: string;
  createdById: number;
  description: string;
  id: number;
  module: string;
  organizationId: number;
  status: number;
  title: string;
  updatedAt: string;
  updatedById: number;
}

export interface IRolePermissions {
  description: string;
  hasPermission: true;
  module: string;
  permissionid: number;
  role: string;
  roleId: number;
  title: string;
  action: string;
  parents: string[];
}
