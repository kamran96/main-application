import { railsHttp } from "../utils/http";

export const branchDeleteAPI = (payload) =>
  railsHttp.put(`/users/branch/delete`, payload);

export const getBranchByIdAPI = (key?: string, id?: number) =>
  railsHttp.get(`/users/branch/${id}`);
