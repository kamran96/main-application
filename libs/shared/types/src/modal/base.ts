export interface IBase {
  id?: number;
  createdAt?: string;
  createdById?: number;
  updatedAt?: string;
  updatedById?: number;
  status?: number;
  branchId?: number;
  organizationId?: number;
  isReturn?: boolean;
}

export class IBaseResponse {
  id?: number;
  createdAt?: string;
  createdById?: number;
  updatedAt?: string;
  updatedById?: number;
  status?: number;
  branchId?: number;
  organizationId?: number;
}
export interface IPagination {
  total?: number;
  offset?: number;
  total_pages?: number;
  page_size?: number;
  page_total?: number;
  page_no?: number;
  sort_column?: string;
  sort_order?: string;
}

export interface IBaseRequest {
  message?: string;
  pagination?: IPagination;
}
export class IBaseRequestResponse {
  message?: string;
  pagination?: IPagination;
}

export interface IBaseAPIError {
  config?: any;
  request?: any;
  response?: IErrorResponse;
}

export interface IErrorData {
  statusCode?: number;
  message?: string;
}

export interface IErrorResponse {
  data?: IErrorData;
  status?: number;
  statusText?: string;
}

export interface IServerError {
  response?: IErrorResponse;
}
