import { QueryKey } from '../modal';
import http from '../utils/http';

export const addOrganizationAPI = (payload) =>
  http.post(`/users/organization`, payload);

export const getOrganizations = () => http.get(`/users/organization`);

export const addBrnachAPI = (payload) => http.post(`/users/branch`, payload);

export const deleteOrganizationAPI = (payload) =>
  http.put(`/organizations/delete`, payload);

export const changeOrganizationApi = (payload) =>
  http.post('/users/organization/change', {
    organizationId: payload,
  });

export const getOrganizationByIdAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`/users/organization/${id}`);
};
