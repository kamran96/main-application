import http, { railsHttp } from "../utils/http";

export const addOrganizationAPI = (payload) =>
  http.post(`organization`, payload);

export const getOrganizations = () => railsHttp.get(`/organizations`);

export const addBrnachAPI = (payload) => http.post(`/branch`, payload);

export const deleteOrganizationAPI = (payload)=> railsHttp.put(`organizations/delete`, payload);

export const getOrganizationByIdAPI = (key?: string, id?: number)=> railsHttp.get(`organization/${id}`);

