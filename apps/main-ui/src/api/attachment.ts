import http from "../utils/http";

export const uploadPdfAPI = (payload) =>
  http.post(`/exports/pdf`, payload);
