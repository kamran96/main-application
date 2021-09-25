import http, { railsHttp } from "./../utils/http";

enum ItemsApi {
  INDEX = "item",
  railsINDEX = `items/index`,
  CREATE_ITEM = `items/create`,
}

export const getItemsList = (key, { page, sortid, query, pageSize = 20 }) => {
  let url = `${ItemsApi.railsINDEX}?page_size=${pageSize}&page_no=${page}&sort=${sortid}`;
  if (query) {
    url = `${url}&query=${query}`;
  }
  return railsHttp.get(url);
};

export const fetchSingleItem = (key, id) => railsHttp.get(`items/${id}`);
export const deleteItems = (payload) => railsHttp.put(`items/delete`, payload);

export const createUpdateItem = (payload) => {
  let url: string = ItemsApi.CREATE_ITEM;
  return railsHttp.post(url, payload);
};

export const createPricingAPI = (payload) => {
  return railsHttp.post(`prices/create`, payload);
};

export const getAllItems = (key?: string, purpose?: string) =>
  railsHttp.get(`/items-all`);

export const getItemByIDAPI = (key?: string, id?: number) =>
  railsHttp.get(`item/${id}`);

export const getPriceByIDAPI = (key?: string, id?: number) =>
  railsHttp.get(`prices/${id}`);

interface IItemGetPaylod {
  id: number;
  start: string;
  end: string;
}

export const getItemDetail = (key?: string, payload?: IItemGetPaylod) => {
  const { start, end, id } = payload;
  let url = `item/${id}`;
  if (start && end) {
    url = `${url}?start=${start}&end=${end}`;
  }
  return railsHttp.get(url);
};

export const getTopRunningItemsAPI = (key?: string) => {
  return railsHttp.get(`items-top-running`);
};

export const getSalesSummaryDataAPI = (
  key?: string,
  payload?: IItemGetPaylod
) => {
  const { start, end, id } = payload;

  let url = `views/${id}`;

  if (start && end) {
    url = `${url}?start=${start}&end=${end}`;
  }
  return railsHttp.get(url);
};

export const duplicateItemsAPI = (payload: any) => {
  let response = railsHttp.post(`items/duplicate`, payload);

  return response;
};

export const StockUpdateAPI = (payload: any) =>
  railsHttp?.post(`/items/stock-update`, payload);
