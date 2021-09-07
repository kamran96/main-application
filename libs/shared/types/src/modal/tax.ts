import { IBase, IBaseRequest } from "./base";
export interface ITaxResponse extends IBaseRequest {
  result: ITaxResult[];
}

export interface ITaxResult extends IBase {
  title: string;
  total: 0;
  tax_rate_items: ITaxRateItems[];
}

export interface ITaxRateItems extends IBase {
  taxRateId: number;
  name: string;
  rate: string;
  compound: boolean;
}
