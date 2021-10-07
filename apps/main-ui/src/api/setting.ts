import http, { railsHttp } from "../utils/http";

// export const createSetting = ()=> http.\

export const uploadImageAPI = (payload: any) =>
  http.post(`attachment`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserAPI = (key, id: number) => {
  return railsHttp.get(`user/${id}`);
};

export const updateProfileAPI = (payload) => http.put(`users/user/update-invited-user/${payload?.userId}`, payload);
