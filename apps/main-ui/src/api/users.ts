import http from '../utils/http';

enum USERS {
  INDEX = 'users/user',
  DELETE = `users/user`,
  INVITE = `users/user/invite`,
}

export const getUsersListAPI = (
  key: any,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `${USERS.INDEX}?page_size=${page_size}&page_no=${page}&sort=${sortid}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const deleteUserAPI = (ids) => http.put(USERS.DELETE, ids);

export const inviteUserAPI = (payload) => http.post(USERS.INVITE, payload);

export const getAllUsers = () => http.get(`/users/index?purpose=ALL`);

export const getALLBranches = () => http.get(`/users/branch`);

export const verifyUserInvitationAPI = (payload) =>
  http?.post(`users/user/verify-invited-user`, payload);

export const userCheckAPI = (payload) => http?.post(`/users/check`, payload);

export const userJoinAPI = (payload) =>
  http?.put(`${USERS.INDEX}/update-invited-user/${payload?.id}`, payload);

export const resendInvitation = (payload) =>
  http?.post(`${USERS.INDEX}/resend-invitation`, payload);
