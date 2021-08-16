import { createContext, useContext } from "react";
import { IAuth, IUser, NOTIFICATIONTYPE } from "../../modal";
import { ILoginActions } from "./globalManager";

interface IAction {
  type?: ILoginActions;
  payload?: any;
}

interface IModal {
  visibility: boolean;
  id: number | string;
}
interface IGlobalContextvalues {
  isOnline?: boolean;
  isUserLogin?: boolean;
  userDetails?: IUser;
  setUserDetails?: (payload: any) => void;
  handleLogin?: (payload: IAction) => void;
  handleRouteHistory?: (payload: any) => void;
  routeHistory?: any;
  userInviteModal?: boolean;
  setUserInviteModal?: (payload: boolean) => void;
  notificationCallback?: (type: NOTIFICATIONTYPE, message?: string) => void;
  itemsModalConfig?: {
    visibility: boolean;
    id: number | string;
  };
  setItemsModalConfig?: (visibility: boolean, id?: number) => void;
  auth?: IAuth;
  setAuth?: (payload?: IAuth) => void;
  accountsModalConfig?: IModal;
  setAccountsModalConfig?: (visibility: boolean, id?: number) => void;
  setOrganizationConfig?: (visibility: boolean, id?: number) => void;
  organizationModalConfig?: IModal;
  isCheckingLoginUser?: boolean;
  pricingModalConfig?: {
    visibility: boolean;
    obj: any;
    updateId: number;
  };
  setPricingModalConfig?: (
    visibility: boolean,
    obj?: any,
    updateId?: number
  ) => void;
  banksModalConfig?: IModal;
  setBanksModalConfig?: (visibility: boolean, id?: number) => void;
  branchModalConfig?: {
    visibility: boolean;
    id: number;
    branchId: number;
  };
  setBranchModalConfig?: (
    visibility: boolean,
    id: number,
    branchId: number
  ) => void;
  paymentsModalConfig?: IModal;
  setPaymentsModalConfig?: (visibility: boolean, id: number) => void;
  categoryModalConfig?: {
    visibility: boolean;
    parent_id: number;
    updateId: number;
    isChild: boolean;
  };
  setCategoryModalConfig?: (
    visibility: boolean,
    parent_id: number,
    updateId: number,
    isChild: boolean
  ) => void;
  attributeConfig?: {
    visibility: boolean;
    categoryObj: any;
  };
  setAttributeConfig?: (visibility: boolean, categoryObj: any) => void;
  dispatchConfigModal?: IModal;
  setDispatchConfigModal?: (visibility: boolean, id?: number) => void;
}

export const globalContext: any = createContext({});
export const useGlobalContext: any = () => useContext(globalContext);
