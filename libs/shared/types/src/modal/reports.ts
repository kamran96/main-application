import { IBaseRequest } from "./base";
import { IAccountsResult } from "./accounts";

export interface ICashFlowResponse extends IBaseRequest {
  result: ICashFlowResult;
}

export interface ICashFlowResult {
  cash_in_flow: ICashFlow[];
  cash_out_flow: ICashFlow[];
}

export interface ICashFlow {
  id: number;
  accountId: number;
  balance: number;
  account: IAccountsResult;
  isLastIndex?: boolean;
}
