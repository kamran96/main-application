import http from '../utils/http';

enum CATEGORY_API {
  INDEX = 'items/category',
}

export const getCategoriesAPI = (
  key?: any,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `${CATEGORY_API.INDEX}`;

  url = `${url}/?page_size=${page_size}&page_no=${page}`;

  return http.get(url);
};
export const getChildCategoriesAPI = (key?: any, parentId?: number) => {
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

export const getCategoryByIdAPI = (key?: any, id?: number) =>
  http.get(`${CATEGORY_API.INDEX}/${id}`);

export const getCategoryAttributesAPI = (key?: any, id?: number) =>
  http.get(`${CATEGORY_API.INDEX}/${id}`);
