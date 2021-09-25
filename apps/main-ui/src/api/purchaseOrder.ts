import { railsHttp } from "./../utils/http";

export const CreatePurchaseOrderAPI = (payload?: any) =>
  railsHttp.post("/purchase_order/create", payload);

export const purchaseOrderList = (
  key?: string,
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
  return railsHttp.get(url);
};
