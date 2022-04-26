import { QueryKey } from '../modal';
import http from '../utils/http';

enum TRANSACTION {
  CREATE = 'accounts/transaction',
  INDEX = 'accounts/transaction',
}

export const createTransactionAPI = (payload) =>
  http.post(TRANSACTION.CREATE, payload);

export const getAllTransactionsAPI = ({ queryKey }: QueryKey) => {
  const page: number = queryKey[1];
  const pageSize: number = queryKey[2];
  const query: string = queryKey[3];
  const status: number = queryKey[4];
  let url = `${TRANSACTION.INDEX}?page_size=${pageSize}&page_no=${page}&status=${status}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  // if (sortid) {
  //   url = `${url}&sort=${sortid}`;
  // }

  return http.get(url);
};

export const deleteTransactionApiById = (payload?: any) =>
  http.put(`accounts/transaction/delete`, payload);

export const getSingleTransactionById = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${TRANSACTION.INDEX}/${id}`);
};

export const updateTransactionDraftStatus = (userId?: number) => {
  return http.put(`accounts/transaction/approve/${userId}`);
};
