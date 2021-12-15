import http from '../utils/http';

export const createTaxAPI = (payload: any) => http?.post(`tax-rate`, payload);

export const getTaxesListAPI = (
  key: any,
  page = 1,
  pageSize = 20,
  status: 1 | 2 = 1
) => {
  const url = `tax-rate?page_size=${pageSize}&page=${page}&status=${status}`;

  return http?.get(url);
};
export const getTaxByIdAPI = (key: any, id?: number) =>
  http?.get(`tax-rate/${id}`);
