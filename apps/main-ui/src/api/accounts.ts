import { QueryKey } from '../modal';
import http from '../utils/http';

enum ACCOUNT {
  INDEX = `accounts/account`,
  RAILS_LIST = `accounts/account`,
  SECONDARY_ACCOUNTS = `accounts/account/secondary-accounts`,
  CREATE_ACCOUNT = `accounts/account`,
}

export const createUpdateAccountAPI = (payload) =>
  http.post(`${ACCOUNT.CREATE_ACCOUNT}`, payload);

export const getAllAccountsAPI = ({ queryKey }: QueryKey) => {
  const page: number = queryKey[1];
  const sortid: string = queryKey[2];
  const page_size: number = queryKey[3];
  const query: string = queryKey[4];
  let url = `${ACCOUNT.RAILS_LIST}?page_size=${page_size}&page_no=${page}`;
  if (sortid && sortid !== null) {
    url = `${url}&sort=${sortid}`;
  }

  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const getAllAccounts = ({ queryKey }: QueryKey) => {
  const purpose = queryKey[1] || 'ALL';
  return http.get(`${ACCOUNT.RAILS_LIST}?purpose=${purpose}`);
};

export const getSecondaryAccounts = () => http.get(ACCOUNT.SECONDARY_ACCOUNTS);

export const getAccountByIDAPI = ({ queryKey }: QueryKey) => {
  const id: number | string = queryKey[1];
  return http.get(`${ACCOUNT.INDEX}/${id}`);
};

export const deleteAccountsAPI = (ids) => http.put(ACCOUNT.INDEX, ids);

export const getBanks = () => http.get(`accounts/bank`);

export const getBankAccounts = () => http.get(`accounts/bank/account`);

export const getAccountLedger = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  const pageSize = queryKey[2] || 20;
  const page = queryKey[3] || 1;
  const query: string = queryKey[4];
  let url = `${ACCOUNT.INDEX}/ledger/${id}?page_size=${pageSize}&page_no=${page}`;

  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};

export const getRecentAccounts = (key?: any) =>
  http.get(`accounts/recent_accounts`);

export const getAccountsByTypeAPI = ({ queryKey }: QueryKey) => {
  const type = queryKey[1] || 'invoice';
  return http(`accounts/account/type?type=${type}`);
};

export const getAccountCodeAPI = (payload?: { id: number }) =>
  http?.post(`accounts/account/code`, payload);

export const getAccountKeysApi = () => http?.get(`${ACCOUNT.INDEX}/import-csv`);
