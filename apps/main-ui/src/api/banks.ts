import http from "../utils/http";

enum BANKS {
  INDEX = "accounts/bank",
}

export const getBanksList = () => http.get(BANKS.INDEX);
export const getBankAccountsList = ()=> http?.get(`${BANKS.INDEX}/account`);

export const createBankAPI = (payload)=> http?.post(`accounts/bank/account`, payload);