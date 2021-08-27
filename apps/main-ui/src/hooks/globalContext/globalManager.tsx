import { message } from "antd";
import React, { FC, useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { getAllRolesWithPermission, getUserAPI, uploadPdfAPI } from "../../api";
import {
  IBaseAPIError,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
} from "../../modal";
import { IAuth, IUser } from "../../modal/auth";
import { IRolePermissions } from "../../modal/rbac";
import { DecriptionData, EncriptData } from "../../utils/encription";
import { useTheme } from "../useTheme";
import { globalContext } from "./globalContext";

interface IProps {
  children: React.ReactElement<any>;
}

export enum ILoginActions {
  LOGIN = "SET_LOGIN",
  LOGOUT = "SET_LOGOUT",
}

interface IAction {
  type?: ILoginActions;
  payload?: any;
}

export const GlobalManager: FC<IProps> = ({ children }) => {
  /* MUTATIONS */
  const [
    mutateSendPDF,
    { isLoading: sendingPDF, isSuccess: pdfUploaded, reset: resetUPloadPDF },
  ] = useMutation(uploadPdfAPI);
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState("light");

  const [isUserLogin, setIsUserLogin] = useState(false);
  const [auth, setAuth] = useState<IAuth>(null);
  const [userDetails, setUserDetails] = useState<IUser | any>(null);
  const [userInviteModal, setUserInviteModal] = useState<boolean>(false);
  const [history, setHistory] = useState(null);
  const [itemsModalConfig, setItemsModalConfig] = useState<any>({
    visibility: false,
    id: null,
  });
  const [transactionModal, setTransactionModal] = useState<boolean>(false);
  const [preferancesModal, setPreferancesModal] = useState<boolean>(false);
  const [accountsModalConfig, setAccountsModalConfig] = useState<any>({
    visibility: false,
    id: null,
  });
  const [organizationModalConfig, setOrganizationConfig] = useState({
    visibility: false,
    id: null,
  });

  const [pricingModalConfig, setPricingModalConfig] = useState({
    visibility: false,
    obj: null,
    updateId: null,
  });
  const [banksModalConfig, setBanksModalConfig] = useState({
    id: null,
    visibility: false,
  });
  const [paymentsModalConfig, setPaymentsModalConfig] = useState({
    id: null,
    visibility: false,
  });
  const [branchModalConfig, setBranchModalConfig] = useState({
    id: null,
    visibility: false,
    branchId: null,
  });
  const [categoryModalConfig, setCategoryModalConfig] = useState({
    parent_id: null,
    visibility: false,
    updateId: null,
    isChild: false,
  });
  const [attributeConfig, setAttributeConfig] = useState({
    categoryObj: null,
    visibility: false,
  });

  const [dispatchConfigModal, setDispatchConfigModal] = useState({
    visibility: false,
  });
  const [reviewConfigModal, setreviewConfigModal] = useState({
    visibility: false,
  });

  const [rbacConfigModal, setRbacConfigModal] = useState({
    visibility: false,
    id: null,
  });
  const [permissionsConfigModal, setPermissionConfigModal] = useState({
    visibility: false,
    id: null,
  });

  const [rolePermissions, setRolePermissions] = useState<IRolePermissions[]>(
    []
  );

  const [verifiedModal, setVerifiedModal] = useState(false);

  const [toggle, setToggle] = useState(true);

  window.addEventListener("offline", (event) => {
    setIsOnline(false);
  });
  window.addEventListener("online", (event) => {
    setIsOnline(true);
  });

  const handleUploadPDF = async (payload: any) => {
    await mutateSendPDF(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          "Uploaded PDF successfully"
        );
      },

      onError: (error: IServerError) => {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
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

  const handleLogin = (action: IAction) => {
    switch (action.type) {
      case ILoginActions.LOGIN:
        setIsUserLogin(true);
        setAuth(action.payload);
        localStorage.setItem("auth", EncriptData(action.payload));

        break;
      case ILoginActions.LOGOUT:
        localStorage.removeItem("auth");
        setAuth(null);
        setIsUserLogin(false);
        queryCache.clear();
        break;
      default:
        break;
    }
  };

  const checkIsAuthSaved = localStorage.getItem("auth");
  const isSidebarOpen: boolean = JSON.parse(localStorage.getItem("isToggle"));

  useEffect(() => {
    if (isSidebarOpen !== null) {
      setToggle(isSidebarOpen);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (checkIsAuthSaved) {
      let decriptedData = DecriptionData(checkIsAuthSaved);
      let user: IUser = decriptedData.users;
      setAuth(decriptedData);
      setUserDetails(user);
    }
  }, [checkIsAuthSaved]);

  let userId = (auth && auth.users && auth.users.id) || null;

  const { isLoading, data, error, isFetched } = useQuery(
    [`loggedInUser`, userId],
    getUserAPI,
    {
      enabled: userId,
      staleTime: Infinity,
      cacheTime: Infinity,
      onSuccess: () => {
        setIsUserLogin(true);
      },
      onError: (error: IBaseAPIError) => {
        setIsUserLogin(false);
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
        }
      },
    }
  );

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
        let roleIndex = parentRole.findIndex((i) => i === item.role);
        let parents = [];
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

  const errResp: any = error;

  useEffect(() => {
    if (data?.data) {
      const userData: IUser = data.data.result;
      const { result } = data?.data;
      if (result?.theme) {
        setTheme(result?.theme);
      }
      setUserDetails({ ...userData });
    } else if (errResp?.message === "Network Error") {
      notificationCallback(
        NOTIFICATIONTYPE.ERROR,
        `${errResp.message} please check your Internet Connection`
      );
    }
  }, [data, checkIsAuthSaved, errResp]);

  // useEffect(() => {
  //   setIsUserLogin(true);
  //   setUserDetails({
  //     id: 81,
  //     roleId: 54,
  //     name: "Raymundo Friesen",
  //     password: "$2a$12$5wayqyjIF.nU402JAyrP8uM4dtDWyzNeNBL.jQ1PyeCHqM1eUnM3y",
  //     branchId: 104,
  //     organizationId: 94,
  //     status: 1,
  //     createdAt: "2020-10-27T07:09:46.112Z",
  //     updatedAt: "2020-10-27T07:09:46.112Z",
  //     createdById: null,
  //     updatedById: null,
  //     profile: {
  //       id: 44,
  //       userId: 81,
  //       fullName: "Shawn Crooks",
  //       email: "bonny@mann-gleason.org",
  //       country: "Guatemala",
  //       attachmentId: null,
  //       phoneNumber: "1-429-387-3404 x703",
  //       landLine: "1-107-359-5570",
  //       cnic: "066819947",
  //       website: "http://turcotte.biz/denver_ryan",
  //       location: "Schuster Walks",
  //       bio: "Randall Hodkiewicz Parker",
  //       jobTitle: "General",
  //       marketingStatus: 1,
  //       attachment: null,
  //     },
  //     organization: {
  //       id: 94,
  //       name: "phunar",
  //       permanentAddress: "gilgit",
  //       niche: "bussiness software",
  //       residentialAddress: "gilgit",
  //       financialEnding: "asf",
  //       status: 1,
  //       createdAt: "2020-10-27T12:15:06.361Z",
  //       updatedAt: "2020-10-27T12:15:06.361Z",
  //     },
  //     role: {
  //       id: 54,
  //       branchId: null,
  //       name: "admin",
  //       status: 1,
  //       createdAt: "2020-10-27T07:09:45.794Z",
  //       updatedAt: "2020-10-27T07:09:45.794Z",
  //     },
  //   });
  // }, []);

  const handleRouteHistory = (history) => {
    setHistory(history);
  };

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

  const checkingUser =
    isFetched && permissionsFetched ? false : isLoading || permissionsFetching;

  return (
    <globalContext.Provider
      value={{
        rolePermissions, // Will return all permissions from BE
        isOnline, // gets info about online and offline network
        isUserLogin, // true or false
        userDetails, // user details
        setUserDetails, // to set user details
        handleLogin, // handle login from signup and login page
        handleRouteHistory, // sets route history
        routeHistory: history, // to get route history
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
          obj: any = null,
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
          isChild: boolean = false
        ) => {
          setCategoryModalConfig({ parent_id, visibility, updateId, isChild });
        },
        attributeConfig,
        setAttributeConfig: (visibility: boolean, categoryObj: any = null) => {
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
          setTheme(payload);
        },
        verifiedModal, setVerifiedModal
      }}
    >
      <WrapperChildren>
        {/* <div className="network-problem">
        Check your internet connection 
      </div> */}

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
