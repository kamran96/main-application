import http from '../utils/http';

export const branchDeleteAPI = (payload) =>
  http.put(`/users/branch/delete`, payload);

export const getBranchByIdAPI = (key?: any, id?: number) =>
  http.get(`/users/branch/${id}`);
