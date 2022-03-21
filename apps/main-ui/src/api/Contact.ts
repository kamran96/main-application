import { QueryKey } from '../modal';
import http from '../utils/http';

enum ContactServiceAPI {
  default = 'contacts/contact',
  index = 'contacts/contact',
}

export const getContacts = ({ queryKey }: QueryKey) => {
  const type = queryKey[1];
  const page = queryKey[2];
  const sortid = queryKey[3];
  const page_size = queryKey[4];
  const query = queryKey[5];

  let url = `${ContactServiceAPI.default}?page_size=${page_size}&page_no=${page}&sort=${sortid}&type=${type}`;
  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const viewSingleContact = ({ queryKey }: QueryKey) => {
  const id = queryKey[1];
  return http.get(`${ContactServiceAPI.default}/${id}`);
};

export const deleteContacts = (payload) =>
  http.put(`${ContactServiceAPI.default}`, payload);

export const create_update_contact = (payload) => {
  const url = `${ContactServiceAPI.default}`;
  return http.post(url, payload);
};

export const getAllContacts = ({ queryKey }: QueryKey) => {
  const purpose: string = queryKey[1];
  return http.get(`${ContactServiceAPI.default}?purpose=${purpose}`);
};

export const getContactLedger = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  const type: number = queryKey[2];
  const query: string = queryKey[3];
  const page_size: number = queryKey[4];
  const page_no: number = queryKey[5];
  let url = `/contacts/contact/ledger/${id}?type=${type}&page_size=${page_size}&page_no=${page_no}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};
