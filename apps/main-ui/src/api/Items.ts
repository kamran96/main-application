import http from './../utils/http';

enum ItemsServiceAPI {
  default = 'items/item',
  PRICE = 'items/price',
}

export const getItemsList = (
  key: any,
  payload?: {
    page: number;
    sortid: string;
    query: string;
    pageSize: number;
  }
) => {
  const { page, sortid, query, pageSize = 20 } = payload;
  let url = `${ItemsServiceAPI.default}?page_size=${pageSize}&page_no=${page}&sort=${sortid}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return http.get(url);
};

export const fetchSingleItem = (key: any, id?: number) =>
  http.get(`${ItemsServiceAPI.default}/${id}`);
export const deleteItems = (payload) =>
  http.put(`${ItemsServiceAPI.default}`, payload);

export const createUpdateItem = (payload) => {
  const url: string = ItemsServiceAPI.default;
  return http.post(url, payload);
};

export const createPricingAPI = (payload) => {
  return http.post(`${ItemsServiceAPI.PRICE}`, payload);
};

export const getAllItems = (key?: any, purpose?: string) =>
  http.get(`${ItemsServiceAPI.default}?purpose=ALL`);

export const getItemByIDAPI = (key?: string, id?: number) =>
  http.get(`item/${id}`);

export const getPriceByIDAPI = (key?: any, id?: number) =>
  http.get(`${ItemsServiceAPI.PRICE}/${id}`);

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
