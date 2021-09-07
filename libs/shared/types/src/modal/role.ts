import { IBaseRequest } from "./base";

export interface IRolesResponse extends IBaseRequest {
  result: IRoleRequest[];
}

export interface IRoleRequest {
  roleId: number;
  name: string;
}
