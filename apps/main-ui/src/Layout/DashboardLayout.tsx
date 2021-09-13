import React, { lazy, FC, Suspense } from "react";
import { DashboardWrapper } from "./DashboardStyles";
import { RouteConfigComponentProps } from "react-router-config";
import { AppLayout } from "./AppLayout";
import { useGlobalContext } from "../hooks/globalContext/globalContext";
import { Redirect } from "react-router-dom";
import { GeneralPreferencesWidget } from "../modules/Settings/GeneralPreferances/GeneralPreferancesWidget";
import renderRoutes from "./renderRoutes";
import { ITheme, Themes } from "../hooks/useTheme/themeColors";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./globalStyles";
// import { UserInviteModal2 } from "./../modules/Users/UserInviteModal/newIndex";

export const DashboardLayout: FC = (props: RouteConfigComponentProps) => {
  /* Dynamic Imports */
  const UserInviteModal = lazy(
    () => import("../modules/Users/UserInviteModal")
  );
  const ItemsEditorWidget = lazy(
    () => import("../modules/Items/ItemsEditorWidget")
  );
  const PricingEditorWidget = lazy(
    () => import("../modules/Items/PricingEditorWidget")
  );
  const CategoryEditorWidget = lazy(
    () => import("../modules/Categories/CategoryEditorWidget")
  );
  const PaymentsEditorWidget = lazy(
    () => import("../modules/Payment/PaymentsEditorWidget")
  );
  const BranchEditorWidget = lazy(
    () => import("../modules/Branch/BranchEditorWidget")
  );
  const AttributeEditorWidget = lazy(
    () => import("../modules/Categories/AttributeEditorWidget")
  );
  const AddBankWidget = lazy(
    () => import("../modules/Business/BankAccounts/AddBank")
  );
  const AddOrganizationForm = lazy(
    () => import("../Containers/AddOrganization/AddOrganizationForm")
  );
  const RolesEditorWidget = lazy(
    () => import("../modules/Rbac/RolesEditorWidget/index")
  );
  const PermissionsEditorWidget = lazy(
    () => import("../modules/Rbac/PermissionsEditorWidget/index")
  );
  const AddAccount = lazy(() => import("../modules/Accounts/AddAccount"));
  const EnableDispatchModal = lazy(
    () => import("../modules/Dispatching/DispatchingWall/EnableDispatch")
  );
  const ReviewModal = lazy(
    () => import("../modules/Dispatching/DispatchingWall/ReviewModal")
  );

  const VerifyAccountModal = lazy(
    () => import("../components/VerificationModal")
  );

  const Paywall = lazy(() => import("../modules/Paywall"));

  const {
    isUserLogin,
    userDetails,
    routeHistory,
    toggle,
    theme,
    darkModeLoading,
  } = useGlobalContext();

  if (!isUserLogin) {
    return <Redirect to="/page/login" />;
  }

  const checkLayout = (children) => {


    const routePath: any = routeHistory?.history?.location.pathname;

    if (userDetails && userDetails.organizationId && userDetails.branchId) {
      return children;
    } else if (routePath.includes("/app/organizations")) {
      return children;
    } else {
      return <Redirect to="/app/organizations" />;
    }
  };

  let layoutTheme: ITheme = {
    colors: Themes[theme],
    toggle,
    theme: theme,
  };

  return (
    <ThemeProvider theme={{ ...layoutTheme }}>
      <DashboardWrapper>
        <GlobalStyle />
        <AppLayout>{checkLayout(renderRoutes(props.route.routes))}</AppLayout>
        {/* <UserInviteModal2 /> */}
        <Suspense fallback={<div></div>}>
          <UserInviteModal />
        </Suspense>
        <Suspense fallback={<></>}>
          <ItemsEditorWidget />
        </Suspense>
        <GeneralPreferencesWidget />
        <Suspense fallback={<></>}>
          <AddAccount />
        </Suspense>
        <Suspense fallback={<></>}>
          <AddOrganizationForm />
        </Suspense>
        <Suspense fallback={<></>}>
          <PricingEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <AddBankWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <BranchEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <PaymentsEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <CategoryEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <AttributeEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <EnableDispatchModal />
        </Suspense>
        <Suspense fallback={<></>}>
          <ReviewModal />
        </Suspense>
        <Suspense fallback={<></>}>
          <RolesEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <PermissionsEditorWidget />
        </Suspense>
        <Suspense fallback={<></>}>
          <Paywall />
        </Suspense>
        <Suspense fallback={<></>}>
          <VerifyAccountModal />
        </Suspense>
      </DashboardWrapper>
    </ThemeProvider>
  );
};
