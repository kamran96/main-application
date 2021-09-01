import http, { railsHttp } from "../utils/http";

enum ACCOUNT {
  INDEX = `account`,
  RAILS_LIST = `accounts/index`,
  SECONDARY_ACCOUNTS = `accounts/secondary_accounts`,
}

export const createUpdateAccountAPI = (payload) =>
  http.post(`/account`, payload);

export const getAllAccountsAPI = (
  key?: string,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `${ACCOUNT.RAILS_LIST}?page_size=${page_size}&page_no=${page}`;
  // if (sortid) {
  //   url = `${url}&sort=${sortid}`;
  // }

  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};

export const getAllAccounts = (key?: string, purpose?: string) =>
  railsHttp.get(`${ACCOUNT.RAILS_LIST}?purpose=${purpose}`);

export const getSecondaryAccounts = () =>
  railsHttp.get(ACCOUNT.SECONDARY_ACCOUNTS);

export const getAccountByIDAPI = (key, id) =>
  railsHttp.get(`${ACCOUNT.INDEX}/${id}`);

export const deleteAccountsAPI = (ids) => http.put(ACCOUNT.INDEX, ids);

export const getBanks = () => railsHttp.get(`/banks/index`);

export const getBankAccounts = () => railsHttp.get(`/banks/account`);

export const getAccountLedger = (
  key,
  id: number,
  pageSize: number = 20,
  page: number = 1,
  query?: string
) => {
  let url = `/accounts/ledger?id=${id}&page_size=${pageSize}&page_no=${page}`;

  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};

export const getRecentAccounts = (key?: string) =>
  railsHttp.get(`accounts/recent_accounts`);

export const getAccountsByTypeAPI = (key?: string, type: string = "invoice") =>
  railsHttp(`account?type=${type}`);
