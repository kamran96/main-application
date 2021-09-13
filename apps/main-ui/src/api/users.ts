import http, { railsHttp } from '../utils/http';

enum USERS {
  INDEX = 'users/index',
  DELETE = `user`,
  INVITE = `/user/invite`,
}

export const getUsersListAPI = (
  key?: string,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `${USERS.INDEX}?page_size=${page_size}&page_no=${page}&sort=${sortid}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};

export const deleteUserAPI = (ids) => http.put(USERS.DELETE, ids);

export const inviteUserAPI = (payload) => http.post(USERS.INVITE, payload);

export const getAllUsers = () => railsHttp.get(`/users/index?purpose=ALL`);

export const getALLBranches = () => http.get(`/users/branch`);

export const verifyUserInvitationAPI = (payload) =>
  http?.post(`/user/verify-invited-user`, payload);

export const userCheckAPI = (payload) =>
  railsHttp?.post(`/users/check`, payload);

export const userJoinAPI = (payload) =>
  http?.put(`user/update-invited-user/${payload?.id}`, payload);
