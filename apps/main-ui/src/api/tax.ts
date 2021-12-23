import { QueryKey } from '../modal';
import http from '../utils/http';

export const createTaxAPI = (payload: any) => http?.post(`tax-rate`, payload);

export const getTaxesListAPI = ({ queryKey }: QueryKey) => {
  const page: number = queryKey[1] || 1;
  const pageSize: number = queryKey[2] || 20;
  const status: string = queryKey[3];
  const url = `tax-rate?page_size=${pageSize}&page=${page}&status=${status}`;

  return http?.get(url);
};
export const getTaxByIdAPI = (key: any, id?: number) =>
  http?.get(`tax-rate/${id}`);
