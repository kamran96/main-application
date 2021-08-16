import { railsHttp } from "../utils/http";

enum CATEGORY_API {
  INDEX = "categories/index",
}

export const getCategoriesAPI = (
  key?: string,
  page?: number,
  sortid?: string,
  page_size?: number,
  query?: string
) => {
  let url = `${CATEGORY_API.INDEX}`;

  url = `${url}/?page_size=${page_size}&page_no=${page}`;

  return railsHttp.get(url);
};
export const getChildCategoriesAPI = (key?: string, parentId?: number) => {
  let url = `${CATEGORY_API.INDEX}`;

  url = `${url}/?page_size=${10}&page_no=1`;
  if (parentId) {
    url = `${url}&parentId=${parentId}`;
  }

  return railsHttp.get(url);
};

export const createCategoryAPI = (payload?: any) =>
  railsHttp.post(`categories/create`, payload);

export const addAttributesAPI = (payload?: any) =>
  railsHttp.post(`attributes/create`, payload);

export const getAllCategories = () =>
  railsHttp.get(`categories/index?purpose=ALL`);

export const deleteCategoryAPI = (payload?: any) =>
  railsHttp.put(`categories/delete`, payload);

export const getCategoryByIdAPI = (key?: string, id?: number) =>
  railsHttp.get(`categories/${id}`);

export const getCategoryAttributesAPI = (key?: string, id?: number) =>
  railsHttp.get(`category-with-attribute/${id}`);
