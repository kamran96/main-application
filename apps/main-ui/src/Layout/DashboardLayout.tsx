import React, { lazy, FC, Suspense } from 'react';
import { DashboardWrapper } from './DashboardStyles';
import { RouteConfigComponentProps } from 'react-router-config';
import { AppLayout } from './AppLayout';
import { useGlobalContext } from '../hooks/globalContext/globalContext';
import { Redirect, useHistory } from 'react-router-dom';
import { GeneralPreferencesWidget } from '../modules/Settings/GeneralPreferances/GeneralPreferancesWidget';
import renderRoutes from './renderRoutes';
import { ITheme, Themes } from '../hooks/useTheme/themeColors';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';

export const DashboardLayout: any = (props: RouteConfigComponentProps) => {
  /* Dynamic Imports */
  const UserInviteModal = lazy(
    () => import('../modules/Users/UserInviteModal')
  );
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
  const PaymentsEditorWidget = lazy(
    () => import('../modules/Payment/PaymentsEditorWidget')
  );
  const AddOrganizationForm = lazy(
    () => import('../Containers/AddOrganization/AddOrganizationForm')
  );
  const RolesEditorWidget = lazy(
    () => import('../modules/Rbac/RolesEditorWidget/index')
  );
  const BranchEditorWidget = lazy(
    () => import('../modules/Branch/BranchEditorWidget')
  );
  const AddBankWidget = lazy(
    () => import('../modules/Business/BankAccounts/AddBank')
  );
  const PermissionsEditorWidget = lazy(
    () => import('../modules/Rbac/PermissionsEditorWidget/index')
  );
  const EnableDispatchModal = lazy(
    () => import('../modules/Dispatching/DispatchingWall/EnableDispatch')
  );
  const ReviewModal = lazy(
    () => import('../modules/Dispatching/DispatchingWall/ReviewModal')
  );

  const VerifyAccountModal = lazy(
    () => import('../components/VerificationModal')
  );

  const Paywall = lazy(() => import('../modules/Paywall'));

  const ContactsImportWidget = lazy(
    () => import('../modules/Contacts/ContactsImport/ContactImportWidget')
  );

  const ItemsImportWidget = lazy(
    () => import('../modules/Items/ItemsImport/ItemsImportWidgets')
  );

  // const PaymentImportWidget = lazy(
  //   () => import('../modules/Payment/PaymentsImport/PaymentImportWidget')
  // );

  // const AccountsImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Accounts/AccountsImport/AccountsImportWidget'
  //     )
  // );

  // const TransactionImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Business/Transactions/importTransactions/TransactionImportWidget'
  //     )
  // );

  // const BankImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Business/BankAccounts/BanksImport/BankImportWidget'
  //     )
  // );

  // const InvoiceImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Invoice/InvoiceList/invoiceImports/InvoiceImportWidget'
  //     )
  // );

  // const CreditNoteImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Invoice/CreditNoteList/ImportCreditNote/CreditNoteImportWidget '
  //     )
  // );

  // const DebitNoteImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Invoice/DebitNotesList/DebitNoteImport/DebitNoteImportWidget'
  //     )
  // );

  // const QuoteImportWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Business/Quote/QuoteImport/QuoteImportWidget'
  //     )
  // );

  // const PurchaseOrderWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Business/PurchaseOrder/PurchaseOrderList/PurchaseOrderImport/PurchasesOrderWidget'
  //     )
  // );

  // const ImportBillWidget = lazy(
  //   () =>
  //     import(
  //       '../modules/Business/PurchaseOrder/Bills/importBill/ImportBillWidget'
  //     )
  // );

  const { isUserLogin, userDetails, routeHistory, theme, itemsModalConfig } =
    useGlobalContext();

  const history = useHistory();

  if (!isUserLogin) {
    return (
      <Redirect
        to={{
          pathname: '/page/login',
          state: { ...history?.location },
        }}
      />
    );
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
        <Suspense fallback={<div></div>}>
          <PaymentsEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <AddOrganizationForm />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <UserInviteModal />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <RolesEditorWidget />
        </Suspense>
        {/* <UserInviteModal2 /> */}
        <Suspense fallback={<div></div>}></Suspense>
        <GeneralPreferencesWidget />

        <Suspense fallback={<div></div>}>
          <AddBankWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <BranchEditorWidget />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <EnableDispatchModal />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <ReviewModal />
        </Suspense>

        <Suspense fallback={<div></div>}>
          <PermissionsEditorWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <Paywall />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <VerifyAccountModal />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <ContactsImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <ItemsImportWidget />
        </Suspense>
        {/* <Suspense fallback={<div></div>}>
          <PaymentImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <AccountsImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <TransactionImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <BankImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <InvoiceImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <CreditNoteImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <DebitNoteImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <QuoteImportWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <PurchaseOrderWidget />
        </Suspense>
        <Suspense fallback={<div></div>}>
          <ImportBillWidget />
        </Suspense> */}
      </DashboardWrapper>
    </ThemeProvider>
  );
};
