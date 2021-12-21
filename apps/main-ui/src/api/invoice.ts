import http from '../utils/http';
import { QueryKey } from '../modal';

enum INVOICES_API {
  INDEX = 'invoices/invoice',
  CREATE = 'invoices/invoice',
  PO = 'invoices/bill',
  CREDIT_NOTE = 'invoices/credit-note',
  BILL = 'invoices/bill',
}

export const InvoiceCreateAPI = (payload) =>
  http.post(INVOICES_API.CREATE, payload);

export const CreditNoteCreateAPI = (payload) =>
  http.post(INVOICES_API.CREDIT_NOTE, payload);
export const getInvoiceListAPI = ({ queryKey }: QueryKey) => {
  const invoice_type: number | string = queryKey[1];
  const status: string | number = queryKey[2];
  const type: string = queryKey[3];
  const page: number = queryKey[4];
  const pageSize: number = queryKey[5];
  const query: string = queryKey[6];
  let url = `${INVOICES_API.INDEX}?page_size=${pageSize}&page_no=${page}&invoice_type=${invoice_type}&status=${status}&type=${type}`;
  if (query && query !== null) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const getInvoiceByIDAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${INVOICES_API.INDEX}/${id}`);
};

export const purchaseOrderCreateAPI = (payload) =>
  http.post(`purchases/create`, payload);

export const getPoListAPI = ({ queryKey }: QueryKey) => {
  const invoice_type: number | string = queryKey[1];
  const status: string | number = queryKey[2];
  const type: string = queryKey[3];
  const page: number = queryKey[4];
  const pageSize: number = queryKey[5];
  const query: string = queryKey[6];
  let url = `${INVOICES_API.PO}?page_size=${pageSize}&page_no=${page}&status=${status}&type=${type}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const pushDraftToInvoiceAPI = (payload?: any) =>
  http.post(`invoices/draft`, { ...payload });

export const pushDraftToPurchaseAPI = (payload?: any) =>
  http.post(`purchases/draft`, { ...payload });

export const deleteInvoicesAPI = (payload?: any) =>
  http.put(`${INVOICES_API.INDEX}`, payload);

export const createPurchaseEntryAPI = (payload?: any) =>
  http.post(`${INVOICES_API.BILL}`, payload);

export const getPurchasesById = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${INVOICES_API.PO}/${id}`);
};

export const deletePurchaseDrafts = (payload?: any) =>
  http.put(`${INVOICES_API.BILL}`, payload);

export const deleteInvoiceDrafts = (payload?: any) =>
  http.put(INVOICES_API.INDEX, payload);

export const invoiceDashboardDetailsAPI = (key?: any) =>
  http.get(`/invoice-details`);

export const draftInvoicesSuggestAPI = (key?: any) =>
  http.get('/invoice-draft');

export const getInvoiceNumber = ({ queryKey }: QueryKey) => {
  const type = queryKey[1];
  return http?.get(`${INVOICES_API.INDEX}/number?type=${type}`);
};

export const getCreditNotes = ({ queryKey }: QueryKey) => {
  const status: string | number = queryKey[1] || 1;
  const page = queryKey[2] || 1;
  const pageSize = queryKey[3] || 10;
  const query: string = queryKey[4] || '';
  let url = `${INVOICES_API.CREDIT_NOTE}?page_size=${pageSize}&page_no=${page}&status=${status}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const creditNoteViewAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http?.get(`${INVOICES_API?.CREDIT_NOTE}/${id}`);
};

export const topSuggestInvoicesAPI = (key?: any) => http.get('invoices-top');

export const invoiceFlowChartAPI = (key?: any) =>
  http.get('/invoice-flow-chart');

export const quotationApproveAPI = (id: string | number) =>
  http?.put(`quote-update/${id}`);
