import http from './../utils/http';
export const createBillAPI = (payload?: any) =>
  http.post('bills/create', payload);

export const getBillsIndexAPI = (
  key?: string,
  status = 'PROCESSED',
  page?: number,
  pageSize = 20,
  query?: string
) => {
  let url = `bills/index?page_no=${page}&page_size=${pageSize}&status=${status}`;

  if (query) {
    url = `${url}&query=${query}`;
  }

  return http.get(url);
};
