import { railsHttp } from "../utils/http";

export const getInvoiceAgainstID = (key?: string, payload?: any) =>
  railsHttp.get(
    `invoices/credits/${payload.id}?paymentMode=${payload.paymentMode}`
  );
export const paymentCreateAPI = (payload) => {
  return railsHttp.post(`payments/create`, payload);
};

export const paymentIndexAPI = (
  key?: string,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string,
  paymentType?: number,

) => {
  let url = `payments/index?page_size=${page_size}&page_no=${page}&sort=${sortid}&paymentType=${paymentType}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};

interface IPaymentDeletePayload {
  ids: number[];
}

export const paymentDeleteAPI = (payload?: IPaymentDeletePayload) =>
  railsHttp.put("payments/delete", payload);
