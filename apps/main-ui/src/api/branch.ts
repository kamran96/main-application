import { railsHttp } from "../utils/http";

export const branchDeleteAPI = (payload) =>
  railsHttp.put(`branch/delete`, payload);

export const getBranchByIdAPI = (key?: string, id?: number) =>
  railsHttp.get(`/branch/${id}`);
