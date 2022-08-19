import http from '../utils/http';

// export const createSetting = ()=> http.\

export const uploadImageAPI = (payload: any) =>
  http.post(`attachment`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getUserAPI = (key: any, id?: number) => {
  return http.get(`user/${id}`);
};

export const updateProfileAPI = (payload) =>
  http.put(`users/user/update-invited-user/${payload?.userId}`, payload);

export const updateUserProfileAPI = (payload) =>
  http.put(`users/user/profile/${payload?.userId}`, payload);
