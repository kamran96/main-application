import { QueryKey } from '../modal';
import http from './../utils/http';

enum ItemsServiceAPI {
  default = 'items/item',
  PRICE = 'items/price',
}

export const getItemsList = ({ queryKey }: QueryKey) => {
  const page = queryKey[1];
  const sortid = queryKey[2];
  const query = queryKey[3];
  const pageSize = (queryKey[4] = 20);

  let url = `${ItemsServiceAPI.default}?page_size=${pageSize}&page_no=${page}&sort=${sortid}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const fetchSingleItem = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${ItemsServiceAPI.default}/${id}`);
};
export const deleteItems = (payload) =>
  http.put(`${ItemsServiceAPI.default}`, payload);

export const createUpdateItem = (payload) => {
  const url: string = ItemsServiceAPI.default;
  return http.post(url, payload);
};

export const createPricingAPI = (payload) => {
  return http.post(`${ItemsServiceAPI.PRICE}`, payload);
};

export const getAllItems = ({ queryKey }: QueryKey) => {
  const purpose: string = queryKey[1];
  return http.get(`${ItemsServiceAPI.default}?purpose=ALL`);
};

export const getItemByIDAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`items/item/${id}`); // item/{id}
};

export const getPriceByIDAPI = ({ queryKey }: QueryKey) => {
  const id = queryKey[1];
  return http.get(`${ItemsServiceAPI.PRICE}/${id}`);
};

interface IItemGetPaylod {
  id: number;
  start: string;
  end: string;
}

export const getItemDetail = (key?: any, payload?: IItemGetPaylod) => {
  const { start, end, id } = payload;
  let url = `item/${id}`;
  if (start && end) {
    url = `${url}?start=${start}&end=${end}`;
  }
  return http.get(url);
};

export const getTopRunningItemsAPI = (key?: any) => {
  return http.get(`items-top-running`);
};

export const getSalesSummaryDataAPI = (key?: any, payload?: IItemGetPaylod) => {
  const { start, end, id } = payload;

  let url = `views/${id}`;

  if (start && end) {
    url = `${url}?start=${start}&end=${end}`;
  }
  return http.get(url);
};

export const duplicateItemsAPI = (payload: any) => {
  const response = http.post(`items/duplicate`, payload);

  return response;
};

export const StockUpdateAPI = (payload: any) =>
  http?.post(`/items/stock-update`, payload);

export const getItemsKeysApi = () =>
  http?.get(`${ItemsServiceAPI.default}/import-csv`);

export const validateItemCodeAPI = (payload: string) =>
  http?.post(`${ItemsServiceAPI.default}/code-validate`, payload);
