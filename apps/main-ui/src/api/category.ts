import { QueryKey } from '../modal';
import http from '../utils/http';

enum CATEGORY_API {
  INDEX = 'items/category',
}

export const getCategoriesAPI = ({ queryKey }: QueryKey) => {
  const page = queryKey[1];
  const sortid = queryKey[2];
  const page_size = queryKey[3];
  const query = queryKey[4];
  let url = `${CATEGORY_API.INDEX}`;

  url = `${url}/?page_size=${page_size}&page_no=${page}`;

  return http.get(url);
};
export const getChildCategoriesAPI = ({ queryKey }: QueryKey) => {
  const parentId: number = queryKey[1];
  let url = `${CATEGORY_API.INDEX}`;

  url = `${url}/?page_size=${10}&page_no=1`;
  if (parentId) {
    url = `${url}&parentId=${parentId}`;
  }

  return http.get(url);
};

export const createCategoryAPI = (payload?: any) =>
  http.post(`${CATEGORY_API.INDEX}`, payload);

export const addAttributesAPI = (payload?: any) =>
  http.post(`${CATEGORY_API.INDEX}/attribute`, payload);

export const getAllCategories = () =>
  http.get(`${CATEGORY_API.INDEX}?purpose=ALL`);

export const deleteCategoryAPI = (payload?: any) =>
  http.put(`${CATEGORY_API.INDEX}`, payload);

export const getCategoryByIdAPI = ({ queryKey }: QueryKey) => {
  const id = queryKey[1];
  return http.get(`${CATEGORY_API.INDEX}/${id}`);
};

export const getCategoryAttributesAPI = ({ queryKey }: QueryKey) => {
  const id: number = queryKey[1];
  return http.get(`${CATEGORY_API.INDEX}/${id}`);
};
