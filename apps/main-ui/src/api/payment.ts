import http from '../utils/http';

enum PAYMENTS {
  CREATE = `/payments/payment`,
  INDEX = `payments/payment`,
}

export const getInvoiceAgainstID = (key?: any, payload?: any) =>
  http.get(
    `invoices/invoice/contact/${payload.id}?type=${payload.paymentMode}`
  );
export const paymentCreateAPI = (payload) => {
  return http.post(PAYMENTS.CREATE, payload);
};

export const paymentIndexAPI = (
  key?: any,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string,
  paymentType?: number
) => {
  let url = `${PAYMENTS.INDEX}?page_size=${page_size}&page_no=${page}&paymentType=${paymentType}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

interface IPaymentDeletePayload {
  ids: number[];
}

export const paymentDeleteAPI = (payload?: IPaymentDeletePayload) =>
  http.put('payments/payment/delete', payload);
