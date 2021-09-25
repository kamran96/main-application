import http from '../utils/http';

export const CreateRoleAPI = (payload?: any) => http.post(`rbac/role`, payload);

export const getRbacListAPI = (key?: string) => http.get(`/users/rbac/role`);

export const getPermissionModulesAPI = (key?: string) =>
  http.get(`rbac/module`);

export const CreatePermissionsAPI = (payload?: any) =>
  http.post(`rbac/permission`, payload);

export const getPermissionsListAPI = (
  key?: any,
  page: number = 1,
  pageSize: number = 20
) => http.get(`rbac/permission?pageSize=${pageSize}&page=${page}`);

export const deletePermissionAPI = (payload?: any) =>
  http.put(`/rbac/permission/delete`, payload);

export const deleteRolesAPI = (payload?: any) =>
  http.put(`/rbac/role/delete`, payload);
export const permissionsShowAPI = (key?: string, type?: string) =>
  http.get(`rbac/permission/show?type=${type}`);

export const addRolePermissionAPI = (payload?: any) =>
  http.post(`rbac/role-permission`, payload);

export const getAllRolesWithPermission = () =>
  http.get(`/users/rbac/role-with-permission`);

export const getRoleByIDAPI = (key, id) => http.get(`rbac/role/${id}`);
