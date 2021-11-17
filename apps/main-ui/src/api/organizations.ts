import http, { railsHttp } from "../utils/http";

export const addOrganizationAPI = (payload) =>
  http.post(`/users/organization`, payload);

export const getOrganizations = () => railsHttp.get(`/users/organization`);

export const addBrnachAPI = (payload) => http.post(`/users/branch`, payload);

export const deleteOrganizationAPI = (payload)=> railsHttp.put(`/organizations/delete`, payload);

export const getOrganizationByIdAPI = (key?: string, id?: number)=> railsHttp.get(`/users/organization/${id}`);

