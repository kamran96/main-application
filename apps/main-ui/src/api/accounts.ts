import http from "../utils/http";

enum ACCOUNT {
  INDEX = `accounts/account`,
  RAILS_LIST = `accounts/account`,
  SECONDARY_ACCOUNTS = `accounts/account/secondary-accounts`,
  CREATE_ACCOUNT = `accounts/account`
}

export const createUpdateAccountAPI = (payload) =>
  http.post(`${ACCOUNT.CREATE_ACCOUNT}`, payload);

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

  return http.get(url);
};

export const getAllAccounts = (key?: string, purpose?: string) =>
  http.get(`${ACCOUNT.RAILS_LIST}?purpose=${purpose}`);

export const getSecondaryAccounts = () =>
  http.get(ACCOUNT.SECONDARY_ACCOUNTS);

export const getAccountByIDAPI = (key, id) =>
  http.get(`${ACCOUNT.INDEX}/${id}`);

export const deleteAccountsAPI = (ids) => http.put(ACCOUNT.INDEX, ids);

export const getBanks = () => http.get(`accounts/bank`);

export const getBankAccounts = () => http.get(`accounts/bank/account`);

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

  return http.get(url);
};

export const getRecentAccounts = (key?: string) =>
  http.get(`accounts/recent_accounts`);

export const getAccountsByTypeAPI = (key?: string, type: string = "invoice") =>
  http(`account?type=${type}`);
