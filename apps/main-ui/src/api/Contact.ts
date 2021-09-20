import http, { railsHttp } from "../utils/http";

enum ContactAPI {
  INDEX = "contacts",
  railsINDEX = "contacts/index",
}

enum ContactServiceAPI{
  default = 'contacts/contact',
  index = 'contacts/contact',
  
}


export const getContacts = (
  key?: string,
  type?: number,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `contacts/contact?page_size=${page_size}&page_no=${page}&sort=${sortid}&type=${type}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};

export const viewSingleContact = (key?: string, id?: number) =>
  railsHttp.get(`contacts/${id}`);

export const deleteContacts = (payload) =>
  http.put(`${ContactAPI.INDEX}`, payload);

export const create_update_contact = (payload) => {
  let url = `contacts/create`;
  return railsHttp.post(url, payload);
};

export const getAllContacts = (key?: string, purpose?: string) =>
  railsHttp.get(`${ContactAPI.railsINDEX}?purpose=${purpose}`);

export const getContactLedger = (
  key?: string,
  id?: number,
  type?: number,
  query?: string,
  page_size?: number,
  page_no?: number
) => {
  let url = `/contacts/ledger/${id}?type=${type}&page_size=${page_size}&page_no=${page_no}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return railsHttp.get(url);
};
