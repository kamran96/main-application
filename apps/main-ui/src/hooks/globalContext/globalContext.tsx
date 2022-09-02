import { createContext, useContext } from 'react';
import { IAuth, IUser, NOTIFICATIONTYPE } from '../../modal';
import { ILoginActions } from './globalManager';
import { IRolePermissions } from '@invyce/shared/types';
import { IThemeVariables } from '../useTheme/themeColors';

interface IAction {
  type?: ILoginActions;
  payload?: any;
}

interface IModalsConfig {
  visibility?: boolean;
  id?: string | number;
  [key: string]: any;
}

export interface IPaymentsModal extends IModalsConfig {
  type?: 'payable' | 'receivable';
  orders?: string[] | number[];
  contactId?: number;
}

export type IImportType =
  | 'accounts'
  | 'contacts'
  | 'invoices'
  | 'quotes'
  | 'payments'
  | 'creditNotes'
  | 'debitNotes'
  | 'items'
  | 'transactions'
  | 'banks'
  | 'trialBalance'
  | 'invoices'
  | 'purchaseOrder'
  | 'bills'
  | null;
interface IImportsModalConfig extends IModalsConfig {
  type?: IImportType;
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
  paymentsModalConfig?: IPaymentsModal;
  setPaymentsModalConfig?: (
    visibility: boolean,
    id?: number,
    config?: {
      type?: 'payable' | 'receivable';
      orders?: string[] | number[];
      contactId?: number;
    }
  ) => void;
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
  contactsImportConfig: IImportsModalConfig;
  setContactsImportConfig: (visibility: boolean, type: IImportType) => void;
  itemsImportconfig: IImportsModalConfig;
  setItemsImportconfig: (visibility: boolean, type: IImportType) => void;
  paymentsImportConfig: IImportsModalConfig;
  setPaymentsImportConfig: (visibility: boolean, type: IImportType) => void;
  accountsImportConfig: IImportsModalConfig;
  setAccountsImportConfig: (visibility: boolean, type: IImportType) => void;
  transactionsImportConfig: IImportsModalConfig;
  setTransactionsImportConfig: (visibility: boolean, type: IImportType) => void;
  bankImportConfig: IImportsModalConfig;
  setBankImportConfig: (visibility: boolean, type: IImportType) => void;
  refetchUser: () => void;
  trialBalanceImportConfig: IImportsModalConfig;
  setTrialBalanceImportConfig: (visibility: boolean, type: IImportType) => void;
  invoices: IImportsModalConfig;
  setInvoices: (visibility: boolean, type: IImportType) => void;
  creditNote: IImportsModalConfig;
  setCreditNote: (visibility: boolean, type: IImportType) => void;
  debitNote: IImportsModalConfig;
  setDebitNote: (visibilty: boolean, type: IImportType) => void;
  quotes: IImportsModalConfig;
  setQuotes: (visibility: boolean, type: IImportType) => void;
  purchaseOrder: IImportsModalConfig;
  setPurchaseOrder: (visibility: boolean, type: IImportType) => void;
  bills: IImportsModalConfig;
  setBills: (visibility: boolean, type: IImportType) => void;
  refetchPermissions: () => void;
  userAuthenticated: boolean;
  Colors: IThemeVariables;
}

export const globalContext = createContext<Partial<IGlobalContextvalues>>({});
export const useGlobalContext = () => useContext(globalContext);
