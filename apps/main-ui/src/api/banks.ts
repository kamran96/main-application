import http from '../utils/http';
import { QueryKey } from '../modal';

enum BANKS {
  INDEX = 'accounts/bank',
}

export const getBanksList = () => http.get(BANKS.INDEX);

export const getBankAccountsList = ({ queryKey }: QueryKey) => {
  const sortid : string = queryKey[1];
  let url = `${BANKS.INDEX}/account`;
  if (sortid && sortid !== null) {
    url = `${url}?sort=${sortid}`;
  }

  return http?.get(url)
};

export const createBankAPI = (payload) =>
  http?.post(`accounts/bank/account`, payload);

export const  getBankKeysApi = () => http?.get(`${BANKS.INDEX}/import-csv`)