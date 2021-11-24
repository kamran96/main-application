import { IPagination } from '..';

export interface IPermission {
  title: string;
  description: string;
  module: string;
  status: number;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  level: number;
  parentId: string;
  status: number;
  organizationid: string;
}

export interface IRoleWithResponse {
  message: string;
  status: number;
  result?: IRole[] | IRole;
}

export interface IRoleWithParent {
  roles: IRole;
  parentRole: IRole;
}

export interface IRoleWithParentWithResponse {
  message: string;
  status: number;
  result: IRoleWithParent;
}

export interface IRolePermissionWithResponse {
  message: string;
  status: number;
  result: IRolePermission;
}

export interface IRolePermission {
  hasPermission: boolean;
  roleId: string;
  permissionId: string;
  organizationId: string;
}

export interface IPermissionResponse {
  message: string;
  status: number;
  result?: IPermission[] | IPermission;
  pagination?: IPagination;
}
