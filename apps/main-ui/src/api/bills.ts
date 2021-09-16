import { railsHttp } from "./../utils/http";
export const createBillAPI = (payload?: any) =>
  railsHttp.post("bills/create", payload);

export const getBillsIndexAPI = (
  key?: string,
  status: string = "PROCESSED",
  page?: number,
  pageSize: number = 20,
  query?: string
) => {
  let url = `bills/index?page_no=${page}&page_size=${pageSize}&status=${status}`;

  if (query) {
    url = `${url}&query=${query}`;
  }

  return railsHttp.get(url);
};
