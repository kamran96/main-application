import { QueryKey } from '../modal';
import http from '../utils/http';

enum PAYMENTS {
  CREATE = `/payments/payment`,
  INDEX = `payments/payment`,
}

export const getInvoiceAgainstID = ({ queryKey }: QueryKey) => {
  const payload = queryKey[1];

  return http.get(
    `invoices/invoice/contact/${payload.id}?type=${payload.paymentMode}`
  );
};

export const paymentCreateAPI = (payload) => {
  return http.post(PAYMENTS.CREATE, payload);
};

export const paymentIndexAPI = ({ queryKey }: QueryKey) => {
  const page: number = queryKey[1];
  const sortid: string = queryKey[2];
  const page_size: number = queryKey[3];
  const query: string = queryKey[4];
  const paymentType: number = queryKey[5];
  let url = `${PAYMENTS.INDEX}?page_size=${page_size}&page_no=${page}&sort=${sortid}&paymentType=${paymentType}`;
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

export const getPaymentKeysApi = () =>
  http?.get(`${PAYMENTS.INDEX}/import-csv`);
