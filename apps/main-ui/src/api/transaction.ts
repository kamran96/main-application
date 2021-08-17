import { railsHttp } from "../utils/http";

enum TRANSACTION {
  CREATE = "transactions/create",
  RAILS_INDEX = "/transactions/index",
}

export const createTransactionAPI = (payload) =>
  railsHttp.post(TRANSACTION.CREATE, payload);

export const getAllTransactionsAPI = (
  key?: string,
  page?: number,
  pageSize?: number,
  query?: string
) => {
  let url = `${TRANSACTION.RAILS_INDEX}?page_size=${pageSize}&page_no=${page}`;
  if(query){
    url= `${url}&query=${query}`
  }
  // if (sortid) {
  //   url = `${url}&sort=${sortid}`;
  // }

  return railsHttp.get(url);
};
