import { QueryKey } from '../modal';
import http from './../utils/http';

export const CreatePurchaseOrderAPI = (payload?: any) =>
  http.post('invoices/purchase-order', payload);

export const purchaseOrderList = ({ queryKey }: QueryKey) => {
  const type = queryKey[1];
  const status: string | number = queryKey[2];
  const page: number = queryKey[3];
  const pageSize: number = queryKey[4];
  const query: string = queryKey[5];
  let url = `invoices/purchase-order?page_size=${pageSize}&page_no=${page}&status=${status}&type=${type}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const getPurchaseOrderByIDAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`invoices/purchase-order/${id}`);
};

export const purchaseOrderDeleteAPI = (payload?: { ids: number[] }) =>
  http?.put(`invoices/purchase-order`, payload);
