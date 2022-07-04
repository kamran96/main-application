import { QueryKey } from '../modal';
import http from '../utils/http';

export const CreateRoleAPI = (payload?: any) =>
  http.post(`users/rbac/role`, payload);

export const getRbacListAPI = (key?: any) => http.get(`/users/rbac/role`);

export const getPermissionModulesAPI = (key?: any) =>
  http.get(`users/rbac/module`);

export const CreatePermissionsAPI = (payload?: any) =>
  http.post(`users/rbac/permission`, payload);

export const getPermissionsListAPI = ({ queryKey }: QueryKey) => {
  const page: number = queryKey[1] || 1;
  const pageSize: number = queryKey[2] || 20;
  return http.get(
    `users/rbac/index-permissions?page_size=${pageSize}&page_no=${page}`
  );
};

export const deletePermissionAPI = (payload?: any) =>
  http.put(`users/rbac/permission/delete`, payload);

export const deleteRolesAPI = (payload?: any) =>
  http.put(`users/rbac/role/delete`, payload);
export const permissionsShowAPI = ({ queryKey }: QueryKey) => {
  const type = queryKey[1];
  return http.get(`/users/rbac/permission/show?type=${type}`);
};
export const addRolePermissionAPI = (payload?: any) =>
  http.post(`users/rbac/role-permission`, payload);

export const getAllRolesWithPermission = () =>
  http.get(`/users/rbac/role-with-permission`);

export const getRoleByIDAPI = ({ queryKey: key }: QueryKey) => {
  const id: number = key[1];
  return http.get(`/users/rbac/role/${id}`);
};
