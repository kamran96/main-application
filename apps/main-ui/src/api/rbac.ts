import http from '../utils/http';

export const CreateRoleAPI = (payload?: any) =>
  http.post(`users/rbac/role`, payload);

export const getRbacListAPI = (key?: any) => http.get(`/users/rbac/role`);

export const getPermissionModulesAPI = (key?: any) =>
  http.get(`users/rbac/module`);

export const CreatePermissionsAPI = (payload?: any) =>
  http.post(`users/rbac/permission`, payload);

export const getPermissionsListAPI = (key?: any, page = 1, pageSize = 20) =>
  http.get(
    `users/rbac/index-permissions?page_size=${pageSize}&page_no=${page}`
  );

export const deletePermissionAPI = (payload?: any) =>
  http.put(`users/rbac/permission/delete`, payload);

export const deleteRolesAPI = (payload?: any) =>
  http.put(`users/rbac/role/delete`, payload);
export const permissionsShowAPI = (key?: any, type?: string) =>
  http.get(`/users/rbac/permission/show?type=${type}`);

export const addRolePermissionAPI = (payload?: any) =>
  http.post(`users/rbac/role-permission`, payload);

export const getAllRolesWithPermission = () =>
  http.get(`/users/rbac/role-with-permission`);

export const getRoleByIDAPI = (key: any, id?: number) =>
  http.get(`rbac/role/${id}`);
