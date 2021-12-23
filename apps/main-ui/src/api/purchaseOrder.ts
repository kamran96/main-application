import http from './../utils/http';

export const CreatePurchaseOrderAPI = (payload?: any) =>
  http.post('/purchase_order/create', payload);

export const purchaseOrderList = (
  key?: any,
  invoice_type?: number | string,
  status?: string | number,
  page?: number,
  pageSize?: number,
  query?: string
) => {
  let url = `purchase_order/index?page_size=${pageSize}&page_no=${page}&status=${status}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};
