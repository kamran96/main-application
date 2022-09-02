import { message } from 'antd';
import { ReactNode, useRef } from 'react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { MultiCompiler } from 'webpack';

import {
  CheckAuthAPI,
  CheckAuthAPIDev,
  LogoutAPI,
  uploadPdfAPI,
} from '../../api';
import { NoInternet } from '../../components/ErrorBoundries/NoInternet';
import {
  IBaseAPIError,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
} from '../../modal';
import { IAuth, IUser } from '../../modal/auth';
import { IRolePermissions } from '../../modal/rbac';
import { DecriptionData, EncriptData } from '../../utils/encription';
import { useTheme } from '../useTheme';
import { IThemeVariables, Themes } from '../useTheme/themeColors';
import { globalContext, IImportType, IPaymentsModal } from './globalContext';
import { useHttp } from './useHttp';

type Theme = 'light' | 'dark';

const stylesheets = {
  light: `https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.12/antd.min.css`,
  dark: `https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.12/antd.dark.min.css`,
};

const isProductionEnv = process.env.NODE_ENV === 'production' || true;
const userCheckApiConfig = (userId) =>
  isProductionEnv ? `users/auth/check` : `users/user/${userId}`;

const AUTH_CHECK_API = isProductionEnv ? CheckAuthAPI : CheckAuthAPIDev;

const createStylesheetLink = (): HTMLLinkElement => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.id = 'antd-stylesheet';
  document.head.appendChild(link);
  return link;
};

const getStylesheetLink = (): HTMLLinkElement =>
  document.head.querySelector('#antd-stylesheet') || createStylesheetLink();

const toggleTheme = (t: Theme) => {
  getStylesheetLink().href = stylesheets[t];
};

interface IProps {
  children: ReactNode;
}

interface IModalsConfig {
  visibility?: boolean;
  id?: string | number;
  [key: string]: unknown;
}

export enum ILoginActions {
  LOGIN = 'SET_LOGIN',
  LOGOUT = 'SET_LOGOUT',
}

interface IAction {
  type?: ILoginActions;
  payload?: unknown;
}

export const GlobalManager: FC<IProps> = ({ children }) => {
  const queryCache = useQueryClient();
  /* MUTATIONS */
  const {
    mutate: mutateSendPDF,
    isLoading: sendingPDF,
    isSuccess: pdfUploaded,
    reset: resetUPloadPDF,
  } = useMutation(uploadPdfAPI);

  const { mutate: mutateLogout, isLoading: logouting } = useMutation(LogoutAPI);

  const [isOnline, setIsOnline] = useState(true);
  const [checkAutherized, setAutherized] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');

  const [isUserLogin, setIsUserLogin] = useState(false);
  const [auth, setAuth] = useState<IAuth>(null);
  const [userDetails, setUserDetails] = useState<IUser>(null);
  const [userInviteModal, setUserInviteModal] = useState<boolean>(false);
  const [itemsModalConfig, setItemsModalConfig] = useState<IModalsConfig>({
    visibility: false,
    id: null,
  });
  const [transactionModal, setTransactionModal] = useState<boolean>(false);
  const [preferancesModal, setPreferancesModal] = useState<boolean>(false);
  const [accountsModalConfig, setAccountsModalConfig] = useState<IModalsConfig>(
    {
      visibility: false,
      id: null,
    }
  );
  const [organizationModalConfig, setOrganizationConfig] =
    useState<IModalsConfig>({
      visibility: false,
      id: null,
    });

  const [pricingModalConfig, setPricingModalConfig] = useState<IModalsConfig>({
    visibility: false,
    obj: null,
    updateId: null,
  });
  const [banksModalConfig, setBanksModalConfig] = useState<IModalsConfig>({
    id: null,
    visibility: false,
  });
  const [paymentsModalConfig, setPaymentsModalConfig] =
    useState<IPaymentsModal>({
      id: null,
      visibility: false,
      type: 'payable',
      orders: [],
      contactId: null,
    });
  const [branchModalConfig, setBranchModalConfig] = useState<IModalsConfig>({
    id: null,
    visibility: false,
    branchId: null,
  });
  const [categoryModalConfig, setCategoryModalConfig] = useState<IModalsConfig>(
    {
      parent_id: null,
      visibility: false,
      updateId: null,
      isChild: false,
    }
  );
  const [attributeConfig, setAttributeConfig] = useState<IModalsConfig>({
    categoryObj: null,
    visibility: false,
  });

  const [dispatchConfigModal, setDispatchConfigModal] = useState<IModalsConfig>(
    {
      visibility: false,
    }
  );
  const [reviewConfigModal, setreviewConfigModal] = useState<IModalsConfig>({
    visibility: false,
  });

  const [rbacConfigModal, setRbacConfigModal] = useState<IModalsConfig>({
    visibility: false,
    id: null,
  });
  const [permissionsConfigModal, setPermissionConfigModal] =
    useState<IModalsConfig>({
      visibility: false,
      id: null,
    });

  const [rolePermissions, setRolePermissions] = useState<IRolePermissions[]>(
    []
  );

  const [contactsImportConfig, setContactsImportConfig] =
    useState<IModalsConfig>({
      visibility: false,
      type: null,
    });

  const [itemsImportconfig, setItemsImportConfig] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [paymentsImportConfig, setPaymentsImportConfig] =
    useState<IModalsConfig>({
      visibility: false,
      type: null,
    });

  const [accountsImportConfig, setAccountsImportConfig] =
    useState<IModalsConfig>({
      visibility: false,
      type: null,
    });

  const [transactionsImportConfig, setTransactionsImportConfig] =
    useState<IModalsConfig>({
      visibility: false,
      type: null,
    });

  const [bankImportConfig, setBankImportConfig] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [trialBalanceImportConfig, setTrialBalanceImportConfig] =
    useState<IModalsConfig>({
      visibility: false,
      type: null,
    });

  const [invoices, setInvoices] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [creditNote, setCreditNote] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [debitNote, setDebitNote] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [quotes, setQuotes] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [purchaseOrder, setPurchaseOrder] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [bills, setBills] = useState<IModalsConfig>({
    visibility: false,
    type: null,
  });

  const [verifiedModal, setVerifiedModal] = useState(false);

  window.addEventListener('offline', (event) => {
    if (isOnline !== false) {
      setIsOnline(false);
    }
  });
  window.addEventListener('online', (event) => {
    if (isOnline !== true) {
      setIsOnline(true);
    }
  });

  const handleUploadPDF = async (payload: unknown) => {
    await mutateSendPDF(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Uploaded PDF successfully'
        );
      },

      onError: (error: IServerError) => {
        if (error?.response?.data?.message) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            IErrorMessages.NETWORK_ERROR
          );
        }
      },
    });
  };

  const history = useHistory();

  const ClearLogin = () => {
    setTheme('light');
    setIsUserLogin(false);
    queryCache.clear();
    setAuth(null);
    setAutherized(false);
    localStorage.clear();
  };

  const handleLogin = async (action: IAction) => {
    switch (action.type) {
      case ILoginActions.LOGIN:
        if (isProductionEnv) {
          setAutherized(true);
        } else {
          localStorage.setItem('auth', EncriptData(action.payload) as string);
          setAuth(action.payload);
        }
        break;
      case ILoginActions.LOGOUT:
        if (isProductionEnv) {
          await mutateLogout('', {
            onSuccess: (data) => {
              notificationCallback(
                NOTIFICATIONTYPE.INFO,
                'Logout Successfully'
              );
              ClearLogin();
            },
            onError: (err: IBaseAPIError) => {
              if (err?.response?.data.message) {
                notificationCallback(
                  NOTIFICATIONTYPE.INFO,
                  `${err.response.data.message}`
                );
              } else {
                notificationCallback(
                  NOTIFICATIONTYPE.ERROR,
                  IErrorMessages.NETWORK_ERROR
                );
              }
            },
          });
        }

        break;
      default:
        break;
    }
  };

  const checkIsAuthSaved = localStorage.getItem('auth');

  useEffect(() => {
    if (checkIsAuthSaved) {
      const decriptedData = DecriptionData(checkIsAuthSaved);
      const user: IUser = decriptedData?.users;

      setAuth((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(decriptedData)) {
          return decriptedData;
        } else {
          return prev;
        }
      });
      setUserDetails((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(user)) {
          return user;
        } else {
          return prev;
        }
      });
    }
  }, [checkIsAuthSaved]);

  const userId = useMemo(() => {
    return auth?.users?.id || null;
  }, [auth?.users?.id]);

  const {
    isLoading,
    refetch: refetchUser,
    isFetched: userAuthenticated,
  } = useHttp(
    {
      apiOption: {
        url: userCheckApiConfig(userId),
        method: 'GET',
      },
      enabled: !!userId || !!checkAutherized,
      onSuccess: (data) => {
        const { result } = data;
        setUserDetails(result);
        setIsUserLogin(true);
        if (result?.theme) {
          setTheme(result?.theme);
        }
      },
      onError: (err: IBaseAPIError) => {
        if (err?.response?.data?.statusCode === 401) {
          ClearLogin();
        }
        setAutherized(false);
      },
    },

    [!!userId, !!checkAutherized]
  );

  useEffect(() => {
    toggleTheme(theme);
  }, [theme]);

  const { isLoading: permissionsFetching, refetch: refetchPermissions } =
    useHttp(
      {
        apiOption: {
          url: `/users/rbac/role-with-permission`,
          method: 'GET',
        },
        enabled: !!isUserLogin,
        onSuccess: ({ result }) => {
          const { parentRole } = result;
          const roles: IRolePermissions[] = result.roles;
          const newResult = roles.map((item) => {
            const roleIndex = parentRole.findIndex((i) => i === item.role);
            const parents = [];
            for (let index = 0; index <= roleIndex; index++) {
              parents.push(parentRole[index]);
            }

            return {
              ...item,
              action: `${item.module}/${item.title}`,
              parents,
            };
          });
          setRolePermissions(newResult);
        },
      },
      [isUserLogin]
    );

  const notificationCallback = (type, info: string) => {
    message.config({
      top: 101,
    });
    switch (type) {
      case NOTIFICATIONTYPE.SUCCESS:
        message.success(info);
        break;
      case NOTIFICATIONTYPE.ERROR:
        message.error(info);
        break;
      case NOTIFICATIONTYPE.INFO:
        message.info(info);
        break;
      case NOTIFICATIONTYPE.WARNING:
        message.warning(info);
        break;
      default:
        message.success(info);
        break;
    }
  };

  const { theme: appTheme, themeLoading } = useTheme(theme);

  const Colors: IThemeVariables = Themes[appTheme];

  const checkingUser = isLoading || permissionsFetching;

  return (
    <globalContext.Provider
      value={{
        userAuthenticated,
        checkAutherized: useMemo(() => {
          return checkAutherized;
        }, [checkAutherized]),
        setAutherized,
        rolePermissions: useMemo(() => {
          return rolePermissions;
        }, [rolePermissions]), // Will return all permissions from BE
        isOnline: useMemo(() => {
          return isOnline;
        }, [isOnline]), // gets info about online and offline network
        isUserLogin: useMemo(() => {
          return isUserLogin;
        }, [isUserLogin]), // true or false
        userDetails: useMemo(() => {
          return userDetails;
        }, [userDetails]), // user details
        setUserDetails, // to set user details
        handleLogin, // handle login from signup and login page
        routeHistory: { history, location: history?.location }, // to get route history
        userInviteModal: useMemo(() => {
          return userInviteModal;
        }, [userInviteModal]), // gets user invite model config
        setUserInviteModal, // sets user invite modal config
        notificationCallback, // responsible for notifications callbacs
        itemsModalConfig: useMemo(() => {
          return itemsModalConfig;
        }, [itemsModalConfig]), // gets items model config
        setItemsModalConfig: (visibility, id) =>
          setItemsModalConfig({ visibility: visibility, id: id }), // sets items model config
        preferancesModal: useMemo(() => {
          return preferancesModal;
        }, [preferancesModal]),
        setPreferancesModal,
        transactionModal: useMemo(() => {
          return transactionModal;
        }, [transactionModal]),
        setTransactionModal,
        auth: useMemo(() => {
          return auth;
        }, [auth]),
        accountsModalConfig: useMemo(() => {
          return accountsModalConfig;
        }, [accountsModalConfig]),
        setAccountsModalConfig,
        organizationModalConfig: useMemo(() => {
          return organizationModalConfig;
        }, [organizationModalConfig]),
        setOrganizationConfig: (visibility: boolean, id: number = null) => {
          setOrganizationConfig({ visibility: visibility, id: id });
        },
        isCheckingLoginUser: useMemo(() => {
          return checkingUser;
        }, [checkingUser]),
        pricingModalConfig: useMemo(() => {
          return pricingModalConfig;
        }, [pricingModalConfig]),
        setPricingModalConfig: (
          visibility: boolean,
          obj: unknown = null,
          updateId: number = null
        ) => {
          setPricingModalConfig({ visibility, obj, updateId });
        },
        banksModalConfig: useMemo(() => {
          return banksModalConfig;
        }, [banksModalConfig]),
        setBanksModalConfig: (visibility: boolean, id: number = null) => {
          setBanksModalConfig({ visibility, id });
        },

        branchModalConfig: useMemo(() => {
          return branchModalConfig;
        }, [branchModalConfig]),
        setBranchModalConfig: (
          visibility: boolean,
          id: number = null,
          branchId: number = null
        ) => {
          setBranchModalConfig({ visibility, id, branchId });
        },
        paymentsModalConfig: useMemo(() => {
          return paymentsModalConfig;
        }, [paymentsModalConfig]),
        setPaymentsModalConfig: (
          visibility: boolean,
          id: number = null,
          config?: {
            type?: 'payable' | 'receivable';
            orders?: string[] | number[];
            contactId?: number;
          }
        ) => {
          const _config = {
            type: config?.type || 'payable',
            orders: config?.orders || [],
            contactId: config?.contactId || null,
          };

          setPaymentsModalConfig({ visibility, id, ..._config });
        },
        categoryModalConfig: useMemo(() => {
          return categoryModalConfig;
        }, [categoryModalConfig]),
        setCategoryModalConfig: (
          visibility: boolean,
          parent_id: number = null,
          updateId: number = null,
          isChild = false
        ) => {
          setCategoryModalConfig({ parent_id, visibility, updateId, isChild });
        },
        attributeConfig: useMemo(() => {
          return attributeConfig;
        }, [attributeConfig]),
        setAttributeConfig: (
          visibility: boolean,
          categoryObj: unknown = null
        ) => {
          setAttributeConfig({ visibility, categoryObj });
        },
        dispatchConfigModal: useMemo(() => {
          return dispatchConfigModal;
        }, [dispatchConfigModal]),
        setDispatchConfigModal: (visibility: boolean) => {
          setDispatchConfigModal({ visibility });
        },
        reviewConfigModal: useMemo(() => {
          return reviewConfigModal;
        }, [reviewConfigModal]),
        setreviewConfigModal: (visibility: boolean) => {
          setreviewConfigModal({ visibility });
        },
        handleUploadPDF,
        resetUPloadPDF,
        pdfStatus: {
          pdfUploaded,
          sendingPDF,
        },
        rbacConfigModal: useMemo(() => {
          return rbacConfigModal;
        }, [rbacConfigModal]),
        setRbacConfigModal: (visibility: boolean, id: number = null) => {
          setRbacConfigModal({ visibility, id });
        },
        permissionsConfigModal: useMemo(() => {
          return permissionsConfigModal;
        }, [permissionsConfigModal]),
        setPermissionConfigModal: (visibility: boolean, id: number = null) => {
          setPermissionConfigModal({ visibility, id });
        },
        theme: useMemo(() => {
          return appTheme;
        }, [appTheme]),
        darkModeLoading: useMemo(() => {
          return themeLoading;
        }, [themeLoading]),
        setTheme: (payload) => {
          setTheme((prev) => {
            if (prev !== payload) {
              return payload;
            } else {
              return prev;
            }
          });
        },
        verifiedModal: useMemo(() => {
          return verifiedModal;
        }, [verifiedModal]),
        setVerifiedModal,
        contactsImportConfig,
        setContactsImportConfig: (visibility: boolean, type: IImportType) => {
          setContactsImportConfig({ visibility });
        },
        itemsImportconfig,
        setItemsImportconfig: (visibility: boolean, type: IImportType) => {
          setItemsImportConfig({ visibility });
        },
        paymentsImportConfig,
        setPaymentsImportConfig: (visibility: boolean, type: IImportType) => {
          setPaymentsImportConfig({ visibility });
        },
        accountsImportConfig,
        setAccountsImportConfig: (visibility: boolean, type: IImportType) => {
          setAccountsImportConfig({ visibility });
        },
        transactionsImportConfig,
        setTransactionsImportConfig: (
          visibility: boolean,
          type: IImportType
        ) => {
          setTransactionsImportConfig({ visibility });
        },
        bankImportConfig,
        setBankImportConfig: (visibility: boolean, type: IImportType) => {
          setBankImportConfig({ visibility });
        },
        trialBalanceImportConfig,
        setTrialBalanceImportConfig: (
          visibility: boolean,
          type: IImportType
        ) => {
          setTrialBalanceImportConfig({ visibility });
        },
        invoices,
        setInvoices: (visibility: boolean, type: IImportType) => {
          setInvoices({ visibility });
        },
        creditNote,
        setCreditNote: (visibility: boolean, type: IImportType) => {
          setCreditNote({ visibility });
        },
        debitNote,
        setDebitNote: (visibility: boolean, type: IImportType) => {
          setDebitNote({ visibility });
        },
        quotes,
        setQuotes: (visibility: boolean, type: IImportType) => {
          setQuotes({ visibility });
        },
        purchaseOrder,
        setPurchaseOrder: (visibility: boolean, type: IImportType) => {
          setPurchaseOrder({ visibility });
        },
        bills,
        setBills: (visibility: boolean, type: IImportType) => {
          setBills({ visibility });
        },
        refetchUser,
        refetchPermissions,
        Colors,
      }}
    >
      <WrapperChildren>
        {!isOnline ? <NoInternet /> : <>{children}</>}
      </WrapperChildren>
    </globalContext.Provider>
  );
};

const WrapperChildren = styled.div`
  position: relative;

  .network-problem {
    position: absolute;
    height: 100%;
    width: 100%;
    background: #a5a5a594;
    z-index: 111;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
