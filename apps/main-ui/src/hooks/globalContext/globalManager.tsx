import { message } from 'antd';
import { ReactNode } from 'react';
import { FC, useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  CheckAuthAPI,
  CheckAuthAPIDev,
  getAllRolesWithPermission,
  LogoutAPI,
  uploadPdfAPI,
} from '../../api';
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
import { globalContext } from './globalContext';

type Theme = 'light' | 'dark';

const stylesheets = {
  light: `https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.12/antd.min.css`,
  dark: `https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.12/antd.dark.min.css`,
};

const isProductionEnv = process.env.NODE_ENV === 'production' || false;


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
  /* MUTATIONS */
  const [
    mutateSendPDF,
    { isLoading: sendingPDF, isSuccess: pdfUploaded, reset: resetUPloadPDF },
  ] = useMutation(uploadPdfAPI);

  const [mutateLogout, resLogout] = useMutation(LogoutAPI);

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
  const [paymentsModalConfig, setPaymentsModalConfig] = useState<IModalsConfig>(
    {
      id: null,
      visibility: false,
    }
  );
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

  const [contactsImportConfig, setContactsImportConfig] = useState<IModalsConfig>({
    visibility: true,
  })

  const [verifiedModal, setVerifiedModal] = useState(false);

  window.addEventListener('offline', (event) => {
    if (isOnline !== false) {
      setIsOnline(false);
    }
  });
  window.addEventListener('online', (event) => {
    console.log('is online fired');
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

  const handleLogin = async (action: IAction) => {
    switch (action.type) {
      case ILoginActions.LOGIN:
        if (process.env.NODE_ENV === 'production') {
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
              setTheme('light');
              setIsUserLogin(false);
              queryCache.clear();
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

        localStorage.removeItem('auth');
        setTheme('light');
        setAuth(null);
        setIsUserLogin(false);
        queryCache.clear();

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

      setAuth(decriptedData);
      setUserDetails(user);
    }
  }, [checkIsAuthSaved]);

  const userId = auth?.users?.id || null;

  /* LoggedInUser is Fetched */
  const { isLoading, isFetched } = useQuery(
    [`loggedInUser`, userId],
    AUTH_CHECK_API,
    {
      cacheTime: Infinity,
      enabled: isProductionEnv ? checkAutherized : userId,

      onSuccess: (data) => {
        if (isProductionEnv) {
          setUserDetails(data?.data?.users);
          setIsUserLogin(true);
        } else {
          const { result } = data?.data;
          setUserDetails(result);
          setIsUserLogin(true);
          if (result?.theme) {
            setTheme(result?.theme);
          }
        }
      },
      onError: (err: IBaseAPIError) => {
        // CancelRequest();
        if (err?.response?.data?.statusCode === 401) {
          handleLogin({ type: ILoginActions.LOGOUT });
        }
        setAutherized(false);
      },
    }
  );

  // const { isLoading, data, error, isFetched } = useQuery(
  //   [`loggedInUser`, userId],
  //   getUserAPI,
  //   {
  //     enabled: userId,
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //     onSuccess: () => {
  //       setIsUserLogin(true);
  //     },
  //     onError: (error: IBaseAPIError) => {
  //       setIsUserLogin(false);
  //       if (
  //         error &&
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.message
  //       ) {
  //         const { message } = error.response.data;
  //         notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
  //       }
  //     },
  //   }
  // );

  useEffect(() => {
    toggleTheme(theme);
  }, [theme]);

  const {
    data: allRolesAndPermissionsData,
    isLoading: permissionsFetching,
    isFetched: permissionsFetched,
  } = useQuery([`roles-permissions`], getAllRolesWithPermission, {
    enabled: isUserLogin,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (allRolesAndPermissionsData?.data?.result) {
      const { result } = allRolesAndPermissionsData.data;
      const { parentRole } = result;
      const roles: IRolePermissions[] =
        allRolesAndPermissionsData.data.result.roles;
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
    }
  }, [allRolesAndPermissionsData]);

  // const errResp: any = error;

  // useEffect(() => {
  //   if (data?.data) {
  //     const userData: IUser = data.data.result;
  //     const { result } = data?.data;
  //     if (result?.theme) {
  //       setTheme(result?.theme);
  //     }
  //     setUserDetails({ ...userData });
  //   } else if (errResp?.message === 'Network Error') {
  //     notificationCallback(
  //       NOTIFICATIONTYPE.ERROR,
  //       `${errResp.message} please check your Internet Connection`
  //     );
  //   }
  // }, [data, checkIsAuthSaved, errResp]);

  message.config({
    top: 101,
  });

  const notificationCallback = (type, info: string) => {
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

  const checkingUser = (isLoading && !isFetched) || permissionsFetching;

  return (
    <globalContext.Provider
      value={{
        checkAutherized,
        setAutherized,
        rolePermissions, // Will return all permissions from BE
        isOnline, // gets info about online and offline network
        isUserLogin, // true or false
        userDetails, // user details
        setUserDetails, // to set user details
        handleLogin, // handle login from signup and login page
        routeHistory: { history, location: history?.location }, // to get route history
        userInviteModal, // gets user invite model config
        setUserInviteModal, // sets user invite modal config
        notificationCallback, // responsible for notifications callbacs
        itemsModalConfig, // gets items model config
        setItemsModalConfig: (visibility, id) =>
          setItemsModalConfig({ visibility: visibility, id: id }), // sets items model config
        preferancesModal,
        setPreferancesModal,
        transactionModal,
        setTransactionModal,
        auth,
        accountsModalConfig,
        setAccountsModalConfig,
        organizationModalConfig,
        setOrganizationConfig: (visibility: boolean, id: number = null) => {
          setOrganizationConfig({ visibility: visibility, id: id });
        },
        isCheckingLoginUser: checkingUser,
        pricingModalConfig,
        setPricingModalConfig: (
          visibility: boolean,
          obj: unknown = null,
          updateId: number = null
        ) => {
          setPricingModalConfig({ visibility, obj, updateId });
        },
        banksModalConfig,
        setBanksModalConfig: (visibility: boolean, id: number = null) => {
          setBanksModalConfig({ visibility, id });
        },

        branchModalConfig,
        setBranchModalConfig: (
          visibility: boolean,
          id: number = null,
          branchId: number = null
        ) => {
          setBranchModalConfig({ visibility, id, branchId });
        },
        paymentsModalConfig,
        setPaymentsModalConfig: (visibility: boolean, id: number = null) => {
          setPaymentsModalConfig({ visibility, id });
        },
        categoryModalConfig,
        setCategoryModalConfig: (
          visibility: boolean,
          parent_id: number = null,
          updateId: number = null,
          isChild = false
        ) => {
          setCategoryModalConfig({ parent_id, visibility, updateId, isChild });
        },
        attributeConfig,
        setAttributeConfig: (
          visibility: boolean,
          categoryObj: unknown = null
        ) => {
          setAttributeConfig({ visibility, categoryObj });
        },
        dispatchConfigModal,
        setDispatchConfigModal: (visibility: boolean) => {
          setDispatchConfigModal({ visibility });
        },
        reviewConfigModal,
        setreviewConfigModal: (visibility: boolean) => {
          setreviewConfigModal({ visibility });
        },
        handleUploadPDF,
        resetUPloadPDF,
        pdfStatus: {
          pdfUploaded,
          sendingPDF,
        },
        rbacConfigModal,
        setRbacConfigModal: (visibility: boolean, id: number = null) => {
          setRbacConfigModal({ visibility, id });
        },
        permissionsConfigModal,
        setPermissionConfigModal: (visibility: boolean, id: number = null) => {
          setPermissionConfigModal({ visibility, id });
        },
        theme: appTheme,
        darkModeLoading: themeLoading,
        setTheme: (payload) => {
          setTheme((prev) => {
            if (prev !== payload) {
              return payload;
            } else {
              return prev;
            }
          });
        },
        verifiedModal,
        setVerifiedModal,
        contactsImportConfig,
        setContactsImportConfig: (visibility: boolean) => {
          setContactsImportConfig({ visibility });
        }
      }}
    >
      <WrapperChildren>
        {/* <div className="network-problem">
        Check your internet connection 
      </div> */}
        {/* <div onClick={()=>setTheme('dark')}>dark mode</div>
      <div onClick={()=>setTheme('light')}>light mode</div> */}

        {children}
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
