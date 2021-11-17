import { createContext, useContext } from 'react';
import { IAuth, IUser, NOTIFICATIONTYPE } from '../../modal';
import { ILoginActions } from './globalManager';
import { IRolePermissions } from '@invyce/shared/types';

interface IAction {
  type?: ILoginActions;
  payload?: any;
}

interface IModalsConfig {
  visibility?: boolean;
  id?: string | number;
  [key: string]: any;
}
interface IGlobalContextvalues {
  checkAutherized: boolean;
  setAutherized: (payload: boolean) => void;
  rolePermissions: IRolePermissions[];
  preferancesModal: boolean;
  setPreferancesModal: (payload: boolean) => void;
  isOnline?: boolean;
  isUserLogin?: boolean;
  userDetails?: IUser;
  transactionModal: boolean;
  setTransactionModal: (payload: boolean) => void;
  reviewConfigModal: IModalsConfig;
  setreviewConfigModal: (payload?: boolean) => void;
  handleUploadPDF: (payload: unknown) => void;
  resetUPloadPDF: () => void;
  setUserDetails?: (payload: IUser) => void;
  handleLogin?: (payload: IAction) => void;
  handleRouteHistory?: (payload: any) => void;
  routeHistory?: any;
  userInviteModal?: boolean;
  setUserInviteModal?: (payload: boolean) => void;
  notificationCallback?: (type: NOTIFICATIONTYPE, message?: string) => void;
  itemsModalConfig?: IModalsConfig;
  setItemsModalConfig?: (visibility: boolean, id?: number) => void;
  auth?: IAuth;
  setAuth?: (payload?: IAuth) => void;
  accountsModalConfig?: IModalsConfig;
  setAccountsModalConfig?: (payload?: {
    visibility: boolean;
    id?: number;
  }) => void;
  setOrganizationConfig?: (visibility: boolean, id?: number) => void;
  organizationModalConfig?: IModalsConfig;
  isCheckingLoginUser?: boolean;
  pricingModalConfig?: IModalsConfig;
  setPricingModalConfig?: (
    visibility: boolean,
    obj?: any,
    updateId?: number
  ) => void;
  banksModalConfig?: IModalsConfig;
  setBanksModalConfig?: (visibility: boolean, id?: number) => void;
  branchModalConfig?: IModalsConfig;
  setBranchModalConfig?: (
    visibility: boolean,
    id?: number,
    branchId?: number
  ) => void;
  paymentsModalConfig?: IModalsConfig;
  setPaymentsModalConfig?: (visibility: boolean, id?: number) => void;
  categoryModalConfig?: IModalsConfig;
  setCategoryModalConfig?: (
    visibility: boolean,
    parent_id?: number,
    updateId?: number,
    isChild?: boolean
  ) => void;
  attributeConfig?: IModalsConfig;
  setAttributeConfig?: (visibility: boolean, categoryObj?: unknown) => void;
  dispatchConfigModal?: IModalsConfig;
  setDispatchConfigModal?: (visibility: boolean, id?: number) => void;
  pdfStatus: {
    pdfUploaded: boolean;
    sendingPDF: boolean;
  };
  rbacConfigModal: IModalsConfig;
  setRbacConfigModal: (visibility: boolean, id?: number) => void;
  permissionsConfigModal: IModalsConfig;
  setPermissionConfigModal: (visibility: boolean, id?: number) => void;
  theme: string;
  darkModeLoading: boolean;
  setTheme: (payload: 'light' | 'dark') => void;
  verifiedModal: boolean;
  setVerifiedModal: (payload: boolean) => void;
}

export const globalContext = createContext<Partial<IGlobalContextvalues>>({});
export const useGlobalContext = () => useContext(globalContext);
