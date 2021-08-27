import http from "../utils/http";

export const uploadPdfAPI = (payload) =>
  http.post(`/attachment/create-pdf`, payload);
