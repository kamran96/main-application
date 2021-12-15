import { ORDER_TYPE } from './../modal/invoice';
import http from '../utils/http';

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
export const getInvoiceListAPI = (
  key?: any,
  invoice_type?: number | string,
  status?: string | number,
  type?: string,
  page?: number,
  pageSize?: number,
  query?: string
) => {
  let url = `${INVOICES_API.INDEX}?page_size=${pageSize}&page_no=${page}&invoice_type=${invoice_type}&status=${status}&type=${type}`;
  if (query && query !== null) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const getInvoiceByIDAPI = (key?: any, id?: number) =>
  http.get(`${INVOICES_API.INDEX}/${id}`);

export const purchaseOrderCreateAPI = (payload) =>
  http.post(`purchases/create`, payload);

export const getPoListAPI = (
  key?: any,
  invoice_type?: number | string,
  status?: string | number,
  type?: string,
  page?: number,
  pageSize?: number,
  query?: string
) => {
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

export const getPurchasesById = (key?: any, id?: number) =>
  http.get(`${INVOICES_API.PO}/${id}`);

export const deletePurchaseDrafts = (payload?: any) =>
  http.put(`${INVOICES_API.BILL}`, payload);

export const deleteInvoiceDrafts = (payload?: any) =>
  http.put(INVOICES_API.INDEX, payload);

export const invoiceDashboardDetailsAPI = (key?: any) =>
  http.get(`/invoice-details`);

export const draftInvoicesSuggestAPI = (key?: any) =>
  http.get('/invoice-draft');

export const getInvoiceNumber = (
  key?: any,
  type: ORDER_TYPE = ORDER_TYPE?.SALE_INVOICE
) => http?.get(`${INVOICES_API.INDEX}/number?type=${type}`);

export const getCreditNotes = (
  key?: any,
  status: string | number = 1,
  page = 1,
  pageSize = 10,
  query?: string
) => {
  let url = `${INVOICES_API.CREDIT_NOTE}?page_size=${pageSize}&page_no=${page}&status=${status}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const creditNoteViewAPI = (key, id) =>
  http?.get(`${INVOICES_API?.CREDIT_NOTE}/${id}`);
export const topSuggestInvoicesAPI = (key?: any) => http.get('invoices-top');

export const invoiceFlowChartAPI = (key?: any) =>
  http.get('/invoice-flow-chart');

export const quotationApproveAPI = (id: string | number) =>
  http?.put(`quote-update/${id}`);
