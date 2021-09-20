import http from "../utils/http";

export const loginApi = (payload)=> http.post(`users/auth/register`, payload);