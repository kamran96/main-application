import http from '../utils/http';

export const addOrganizationAPI = (payload) =>
  http.post(`/users/organization`, payload);

export const getOrganizations = () => http.get(`/users/organization`);

export const addBrnachAPI = (payload) => http.post(`/users/branch`, payload);

export const deleteOrganizationAPI = (payload) =>
  http.put(`/organizations/delete`, payload);

export const getOrganizationByIdAPI = (key?: any, id?: number) =>
  http.get(`/users/organization/${id}`);
