import http from '../utils/http';
import { IInvoiceType, QueryKey } from '../modal';

enum INVOICES_API {
  INDEX = 'invoices/invoice',
  CREATE = 'invoices/invoice',
  CREDIT_NOTE = 'invoices/credit-note',
  BILL = 'invoices/bill',
  PO = 'invoices/purchase-order',
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

export const findInvoiceByID = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  const type:
    | IInvoiceType.INVOICE
    | IInvoiceType.PURCHASE_ORDER
    | IInvoiceType.BILL
    | IInvoiceType.CREDITNOTE
    | IInvoiceType.DEBITNOTE = queryKey[2];

  let url = ``;

  switch (type) {
    case IInvoiceType.INVOICE:
      url = `${INVOICES_API.INDEX}/${id}`;
      break;
    case IInvoiceType.PURCHASE_ORDER:
      url = `${INVOICES_API.PO}/${id}`;
      break;
    case IInvoiceType.BILL:
      url = `${INVOICES_API.BILL}/${id}`;
      break;
    case IInvoiceType.CREDITNOTE || IInvoiceType.DEBITNOTE:
      url = `${INVOICES_API.CREDIT_NOTE}/${id}`;
      break;
    default:
      url = ``;
      break;
  }

  return http.get(url);
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
  let url = `${INVOICES_API.BILL}?page_size=${pageSize}&page_no=${page}&status=${status}&type=${type}`;
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

export const getBillsById = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${INVOICES_API.BILL}/${id}`);
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
  const type = queryKey[1] || 'SI';
  return http?.get(`${INVOICES_API.INDEX}/number?type=${type}`);
};

export const getCreditNotes = ({ queryKey }: QueryKey) => {
  const status: string | number = queryKey[1] || 1;
  const page = queryKey[2] || 1;
  const pageSize = queryKey[3] || 10;
  const invoiceType = queryKey[4] || '';
  const query: string = queryKey[5] || '';
  let url = `${INVOICES_API.CREDIT_NOTE}?page_size=${pageSize}&page_no=${page}&status=${status}&invoice_type=${invoiceType}`;
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

export const deleteCreditNoteAPI = (paylod: { ids: number[]; type: number }) =>
  http.put(`/invoices/credit-note/delete`, paylod);

export const EmailInvoiceAPI = (payload: {
  type: string;
  id: number;
  email: string;
  cc: string[];
  bcc: string[];
}) => http?.post(`invoices/invoice/pdf`, payload);
