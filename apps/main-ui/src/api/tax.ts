import { railsHttp } from "../utils/http";

export const createTaxAPI = (payload: any) =>
  railsHttp?.post(`tax-rate`, payload);

export const getTaxesListAPI = (key: string, page:number=1, pageSize:number=20, status:1|2=1)=>{
    let url =  `tax-rate?page_size=${pageSize}&page=${page}&status=${status}`;

    return railsHttp?.get(url);
}
export const getTaxByIdAPI =(key: string, id)=> railsHttp?.get(`tax-rate/${id}`);