import { railsHttp } from "../utils/http";

enum BANKS {
  INDEX = "/banks/account",
}

export const getBanksList = () => railsHttp.get(BANKS.INDEX);

export const createBankAPI = (payload)=> railsHttp?.post(`banks/account/create`, payload);