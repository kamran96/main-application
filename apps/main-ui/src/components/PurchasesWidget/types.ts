import { IContactType } from '../../modal';

export interface IRequireBody {
  require: boolean;
  message?: string;
}
export interface IPurchaseManagerProps extends IProps {
  requires?: {
    itemId: IRequireBody;
    description: IRequireBody;
    quantity: IRequireBody;
    unitPrice: IRequireBody;
    purchasePrice: IRequireBody;
    itemDiscount: IRequireBody;
    tax: IRequireBody;
    total: IRequireBody;
    costOfGoodAmount: IRequireBody;
    index: IRequireBody;
    accountId: IRequireBody;
  };
}

export enum ISUBMITTYPE {
  RETURN = 'RETURN',
  APPROVE_PRINT = 'APPROVE&PRINT',
  ONLYAPPROVE = 'ONLYAPPROVE',
  DRAFT = 'DRAFT',
}

export interface IProps {
  type?: 'BILL' | 'SI' | 'POE' | 'PO' | 'QO';
  id?: number;
}
