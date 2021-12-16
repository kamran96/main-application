import React, { lazy, FC, Suspense } from 'react';
import { DashboardWrapper } from './DashboardStyles';
import { RouteConfigComponentProps } from 'react-router-config';
import { AppLayout } from './AppLayout';
import { useGlobalContext } from '../hooks/globalContext/globalContext';
import { Redirect } from 'react-router-dom';
import { GeneralPreferencesWidget } from '../modules/Settings/GeneralPreferances/GeneralPreferancesWidget';
import renderRoutes from './renderRoutes';
import { ITheme, Themes } from '../hooks/useTheme/themeColors';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';

export const DashboardLayout: FC = (props: RouteConfigComponentProps) => {
  /* Dynamic Imports */
  // const UserInviteModal = lazy(
  //   () => import('../modules/Users/UserInviteModal')
  // );
  const ItemsEditorWidget = lazy(
    () => import('../modules/Items/ItemsEditorWidget')
  );
  const CategoryEditorWidget = lazy(
    () => import('../modules/Categories/CategoryEditorWidget')
  );
  const AttributeEditorWidget = lazy(
    () => import('../modules/Categories/AttributeEditorWidget')
  );
  const PricingEditorWidget = lazy(
    () => import('../modules/Items/PricingEditorWidget')
  );
  const AddAccount = lazy(() => import('../modules/Accounts/AddAccount'));
  // const PaymentsEditorWidget = lazy(
  //   () => import('../modules/Payment/PaymentsEditorWidget')
  // );
  // const BranchEditorWidget = lazy(
  //   () => import('../modules/Branch/BranchEditorWidget')
  // );
  // const AddBankWidget = lazy(
  //   () => import('../modules/Business/BankAccounts/AddBank')
  // );
  // const AddOrganizationForm = lazy(
  //   () => import('../Containers/AddOrganization/AddOrganizationForm')
  // );
  // const RolesEditorWidget = lazy(
  //   () => import('../modules/Rbac/RolesEditorWidget/index')
  // );
  // const PermissionsEditorWidget = lazy(
  //   () => import('../modules/Rbac/PermissionsEditorWidget/index')
  // );
  // const EnableDispatchModal = lazy(
  //   () => import('../modules/Dispatching/DispatchingWall/EnableDispatch')
  // );
  // const ReviewModal = lazy(
  //   () => import('../modules/Dispatching/DispatchingWall/ReviewModal')
  // );

  // const VerifyAccountModal = lazy(
  //   () => import('../components/VerificationModal')
  // );

  // const Paywall = lazy(() => import('../modules/Paywall'));

  // const ContactsImportWidget = lazy(
  //   () => import('../modules/Contacts/ContactsImport/ContactImportWidget')
  // );

  const { isUserLogin, userDetails, routeHistory, theme, itemsModalConfig } =
    useGlobalContext();

  if (!isUserLogin) {
    return <Redirect to="/page/login" />;
  }

  const checkLayout = (children) => {
    const routePath: any = routeHistory?.history?.location.pathname;

    if (userDetails && userDetails.organizationId && userDetails.branchId) {
      return children;
    } else if (routePath.includes('/app/organizations')) {
      return children;
    } else {
      return <Redirect to="/app/organizations" />;
    }
  };

  const layoutTheme: ITheme = {
    colors: Themes[theme],
    theme: theme === 'dark' ? 'dark' : 'light',
  };

  return (
    <ThemeProvider theme={{ ...layoutTheme }}>
      <DashboardWrapper>
        <GlobalStyle />
        <AppLayout>{checkLayout(renderRoutes(props.route.routes))}</AppLayout>
        <Suspense fallback={<div></div>}>
          <ItemsEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <CategoryEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <AttributeEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <PricingEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <AddAccount />
        </Suspense>
        {/* <UserInviteModal2 /> */}
        {/* <Suspense fallback={<div></div>}>
          <UserInviteModal />
        </Suspense>
        <GeneralPreferencesWidget />
        <Suspense fallback={<></>}>
          <AddOrganizationForm />
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
        <Suspense fallback={<></>}>
          <ContactsImportWidget />
        </Suspense> */}
      </DashboardWrapper>
    </ThemeProvider>
  );
};
