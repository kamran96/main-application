import { ORDER_TYPE } from "./../modal/invoice";
import http, { railsHttp } from "../utils/http";

enum INVOICES_API {
  INDEX = "invoices/index",
  CREATE = "invoices/create",
  PO = "/purchases/index",
  CREDIT_NOTE = "credit-note",
}

export const InvoiceCreateAPI = (payload) =>
  railsHttp.post(INVOICES_API.CREATE, payload);
export const CreditNoteCreateAPI = (payload) =>
  railsHttp.post(INVOICES_API.CREDIT_NOTE, payload);
export const getInvoiceListAPI = (
  key?: string,
  invoice_type?: number | string,
  status?: string | number,
  type?: string,
  page?: number,
  pageSize?: number,
  query?: string
) => {
  let url = `${INVOICES_API.INDEX}?page_size=${pageSize}&page_no=${page}&invoice_type=${invoice_type}&status=${status}&type=${type}`;
   if (query && query!==null){
    url = `${url}&query=${query}`;
  }

   
  return railsHttp.get(url);
};

export const getInvoiceByIDAPI = (key?: string, id?: number) =>
  railsHttp.get(`invoices/${id}`);

export const purchaseOrderCreateAPI = (payload) =>
  railsHttp.post(`purchases/create`, payload);

export const getPoListAPI = (
  key?: string,
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
  return railsHttp.get(url);
};

export const pushDraftToInvoiceAPI = (payload?: any) =>
  railsHttp.post(`invoices/draft`, { ...payload });

export const pushDraftToPurchaseAPI = (payload?: any) =>
  railsHttp.post(`purchases/draft`, { ...payload });

export const deleteInvoicesAPI = (payload?: any) =>
  railsHttp.put(`/invoices`, payload);

export const createPurchaseEntryAPI = (payload?: any) =>
  railsHttp.post(`purchases/create`, payload);

export const getPurchasesById = (key?: string, id?: number) =>
  railsHttp.get(`purchases/${id}`);

export const deletePurchaseDrafts = (payload?: any) =>
  railsHttp.put(`purchases/delete`, payload);

export const deleteInvoiceDrafts = (payload?: any) =>
  railsHttp.put(`invoices/delete`, payload);

export const invoiceDashboardDetailsAPI = (key?: string) =>
  railsHttp.get(`/invoice-details`);

export const draftInvoicesSuggestAPI = (key?: string) =>
  railsHttp.get("/invoice-draft");



export const getInvoiceNumber = (
  key?: string,
  type: ORDER_TYPE = ORDER_TYPE?.SALE_INVOICE
) => railsHttp?.get(`invoice/number?type=${type}`);


export const getCreditNotes = (
  key?: string,
  status: string | number =1,
  page: number=1,
  pageSize: number=10,
  query?: string
) => {
  let url = `${INVOICES_API.CREDIT_NOTE}?page_size=${pageSize}&page_no=${page}&status=${status}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return railsHttp.get(url);
};

export const creditNoteViewAPI = (key, id)=> railsHttp?.get(`${INVOICES_API?.CREDIT_NOTE}/${id}`);
 export const topSuggestInvoicesAPI =(key ?: string)=>
 railsHttp.get("invoices-top");
  
 export const invoiceFlowChartAPI= (key?:string )=>
 railsHttp.get("/invoice-flow-chart");

 export const quotationApproveAPI = (id: string|number)=> railsHttp?.put(`quote-update/${id}`);
