// import { Integrations } from './../modules/Settings/Integrations/index';
// import { PermissionsSettingsContainer } from './../modules/Rbac/Permisions/settings';
// import { BillsList } from '../modules/Business/PurchaseOrder/Bills';
import { RouteConfig } from 'react-router-config';
import { RootLayout } from '../Layout/RootLayout';
import { DefaultLayout } from '../Layout/DefaultLayout';
import { Login } from '../Containers/Login/Login';
import { RedirectToLogin } from './RedirectToLogin';
import { Register } from '../Containers/Register';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { ISupportedRoutes } from '../modal';
import { ContactsContainer } from '../modules/Contacts';
// import { ContactsEditorWidget } from '../modules/Contacts/ContactsEditorWiget';
import { TestComponents } from './../Containers/TestComponents/index';
// import { Items } from './../modules/Items/index';
// import { UsersContainer } from './../modules/Users/index';
// import { Accounts } from './../modules/Accounts/index';
// import { AccountSettings } from '../modules/Settings/AccountSettings';
// import { GeneralPreferances } from '../modules/Settings/GeneralPreferances';
// import { InvoiceContainer } from '../modules/Invoice';
// import { PurchaseOrderContainer } from '../modules/Business/PurchaseOrder';
// import { PurchaseOrderEditorWidget } from '../modules/Business/PurchaseOrder/PurchaseOrderEditorWidget';
// import { TransactionContainer } from '../modules/Business/Transactions';
// import { QuotesContainer } from '../modules/Business/Quote';
// import { QuoteEditorWidget } from '../modules/Business/Quote/QuoteEditorWidget';
// import { AccountsLedger } from '../modules/Accounts/AccountsLedger';
// import { BankAccounts } from '../modules/Business/BankAccounts';
// import { TraialBalance } from '../modules/Business/TrialBalance';
// import { BalanceSheet } from '../modules/Accounts/BalanceSheet';
// import { ContactLedger } from '../modules/Contacts/ContactLedger';
// import { JournalEditor } from '../modules/Business/Transactions/TransactionEditorWidget';
// import { PaymentContainer } from '../modules/Payment';
// import { BillsEditorWidget } from '../modules/Business/PurchaseOrder/BillsEditorWidget';
// import CategoriesRoot from '../modules/Categories';
// import { ItemsViewContainer } from '../modules/Items/ItemsList/ItemsView';
// import { DashboardContainer } from '../modules/Dashboard';
// import { InvoiceEditorWidget } from '../modules/Invoice/InvoiceEditorWidget';
// import { InvoiceView } from '../modules/Invoice/InvoiceView';
// import { PurchaseView } from '../modules/Business/PurchaseOrder/PurchaseOrderList/View';
// import { InvoiceDashboard } from '../modules/Invoice/InvoiceDashboard';
// import { DispatchingContainer } from '../modules/Dispatching';
// import { QuoteView } from '../modules/Business/Quote/QuoteView';
// import { PurchaseEntryView } from '../modules/Business/PurchaseOrder/Bills/View';
// import { RbacContainer } from '../modules/Rbac';
// import { PermissionsContainer } from '../modules/Rbac/Permisions';
import { PERMISSIONS } from '../components/Rbac/permissions';
import { PermissionDenied } from '../components/PermissionDenied';
// import { IncomeStatement } from '../modules/Reports/IncomeStatement';
// import { CashActivityReport } from '../modules/Reports/CashActivityReport';
// import { SettingLayout } from '../modules/Settings/SettingLayout';
// import { SettingRoutes } from '../modules/Settings/utils/SettingRoutes';
import { VerificationLayout } from '../Layout/VerificationLayout';
import { VerifyQuickBooks } from '../modules/Settings/Integrations/Quickbooks/VerifyQuickbooks';
import { VerifyXero } from '../modules/Settings/Integrations/Xero/VerifyXero';
// import { CreditNoteEditorWidget } from '../modules/Invoice/CreditNoteWidget';
// import { Import } from '../components/Import';
import { JoinUser } from '../Containers/JoinUser';
import { VerifyUser } from '../Containers/JoinUser/VerifyUser';
// import { CreditNoteList } from '../modules/Invoice/CreditNoteList';
// import { CreditNoteView } from '../modules/Invoice/CreditNoteList/View';
import { VerifyGmail } from '../modules/Settings/Integrations/Gmail/VerifyGmail';
import { OrganizationWidget } from '../Containers/AddOrganization/OrganizationWidget';
// import { ManageInventoryForm } from '../modules/Items/InventoryManagementForm';
// import { Organizations } from '../Containers/AddOrganization';
import { ForgotPassowrdContainer } from '../Containers/ForgetPassword';

export const routes = (root = '/app'): RouteConfig[] => [
  {
    component: RootLayout,
    routes: [
      {
        path: '/verify',
        component: VerificationLayout,
        routes: [
          {
            path: `/verify/quickbooks`,
            component: VerifyQuickBooks,
          },
          {
            path: `/verify/xero`,
            component: VerifyXero,
          },
          {
            path: `/verify/user`,
            component: VerifyUser,
          },
          {
            path: `/verify/gmail`,
            component: VerifyGmail,
          },
        ],
      },
      {
        path: root,
        component: DashboardLayout,
        routes: [
          {
            path: `${root}${ISupportedRoutes.PERMISSION_DENIED}`,
            component: PermissionDenied,
            exact: true,
          },
          /* RBAC */

          // {
          //   path: `${root}${ISupportedRoutes.RBAC}`,
          //   component: RbacContainer,
          //   restricted: true,
          //   permission: PERMISSIONS.RBAC_ROLE_INDEX,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PERMISSIONS}`,
          //   component: PermissionsContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.RBAC_ROLE_PERMISSION_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PERMISSION_SETTINGS}`,
          //   component: PermissionsSettingsContainer,
          //   restricted: true,
          //   permission: PERMISSIONS.RBAC_ROLE_WITH_PERMISSION,
          //   exact: true,
          // },
          // {
          //   path: `${root}/dashboard`,
          //   component: DashboardContainer,
          // },
          {
            path: `${root}${ISupportedRoutes.CONTACTS}`,
            component: ContactsContainer,
            exact: true,
            restricted: true,
            permission: PERMISSIONS.CONTACTS_INDEX,
          },
          // {
          //   path: `${root}${ISupportedRoutes.CONTACTS_IMPORT}`,
          //   component: Import,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.CONTACTS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CONTACTS}/:id`,
          //   component: ContactLedger,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.CONTACTS_LEDGER,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_CONTACT}`,
          //   component: ContactsEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.CONTACTS_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.UPDATE_CONTACT}/:id`,
          //   component: ContactsEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.CONTACTS_CREATE,
          // },
          // {
          //   exact: true,
          //   path: `${root}/components`,
          //   component: TestComponents,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ITEMS}`,
          //   component: Items,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.ITEMS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.INVENTORY_MANAGEMENT}`,
          //   component: ManageInventoryForm,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.ITEMS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ITEMS}/:id`,
          //   component: ItemsViewContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.ITEMS_SHOW,
          // },
          // {
          //   path: `${root}/users`,
          //   component: UsersContainer,
          //   restricted: true,
          //   permission: PERMISSIONS.USERS_LIST,
          // },
          // /* SETTINGS */
          // // {
          // //   path: `${root}${ISupportedRoutes.PROFILE_SETTING}`,
          // //   component: ProfileSettings,
          // // },
          // {
          //   path: `${root}${ISupportedRoutes.ACCOUNT_SETTING}`,
          //   component: AccountSettings,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PREFERENCES_SETTINGS}`,
          //   component: GeneralPreferances,
          // },
          // /* SETTINGS ROUTES ENDS */

          // /* BUSINESS ROUTES HERE */
          // {
          //   path: `${root}${ISupportedRoutes.INVOICES}`,
          //   component: InvoiceContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.INVOICE_DASHBOARD}`,
          //   component: InvoiceDashboard,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.INVOICES_VIEW}/:id`,
          //   component: InvoiceView,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_SHOW,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_INVOICE}`,
          //   component: InvoiceEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ADD_CREDIT_NOTE}/:id`,
          //   component: CreditNoteEditorWidget,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ADD_CREDIT_NOTE}`,
          //   component: CreditNoteEditorWidget,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_CREATE,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREDIT_NOTES}/:id`,
          //   component: CreditNoteView,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_SHOW,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREDIT_NOTES}`,
          //   component: CreditNoteList,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_INVOICE}/:id`,
          //   component: InvoiceEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.INVOICES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PURCHASE_ORDER}`,
          //   component: PurchaseOrderContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PURCHASES}`,
          //   component: BillsList,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASES_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PURCHASES}/:id`,
          //   component: PurchaseEntryView,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASES_SHOW,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PURCHASE_ORDER}/:id`,
          //   component: PurchaseView,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASE_ORDERS_SHOW,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_PURCHASE_ORDER}`,
          //   component: PurchaseOrderEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_PURCHASE_ORDER}/:id`,
          //   component: PurchaseOrderEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_PURCHASE_Entry}`,
          //   component: BillsEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_PURCHASE_Entry}/:id`,
          //   component: BillsEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PURCHASES_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ACCOUNTS}`,
          //   component: Accounts,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.ACCOUNTS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.ACCOUNTS}/:id`,
          //   exact: true,
          //   component: AccountsLedger,
          //   restricted: true,
          //   permission: PERMISSIONS.ACCOUNTS_LEDGER,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.TRANSACTIONS}`,
          //   component: TransactionContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.TRANSACTIONS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_TRANSACTION}`,
          //   component: JournalEditor,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.TRANSACTIONS_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.QUOTE}`,
          //   component: QuotesContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.QUOTATIONS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.QUOTE}/:id`,
          //   component: QuoteView,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.QUOTATIONS_SHOW,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_QUOTE}`,
          //   component: QuoteEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.QUOTATIONS_CREATE,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CREATE_QUOTE}/:id`,
          //   component: QuoteEditorWidget,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.QUOTATIONS_CREATE,
          // },

          // {
          //   path: `${root}${ISupportedRoutes.BANK_ACCOUNTS}`,
          //   component: BankAccounts,
          //   restricted: true,
          //   exact: true,
          //   permission: PERMISSIONS.BANKS_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.TRIAL_BALANCE}`,
          //   component: TraialBalance,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.BALANCE_SHEET}`,
          //   component: BalanceSheet,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.CASH_ACTIVITY_REPORT}`,
          //   component: CashActivityReport,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.INCOME_STATEMENT}`,
          //   component: IncomeStatement,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.PAYMENTS}`,
          //   component: PaymentContainer,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.PAYMENTS_INDEX,
          // },
          // /* Categories Route */
          // {
          //   path: `${root}${ISupportedRoutes.Categories}`,
          //   component: CategoriesRoot,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.CATEGORIES_INDEX,
          // },
          // {
          //   path: `${root}${ISupportedRoutes.Organizations}`,
          //   component: Organizations,
          //   exact: true,
          //   restricted: true,
          //   permission: PERMISSIONS.ORGANIZATIONS_INDEX,
          // },

          // /* Dispatching Module */

          // {
          //   path: `${root}${ISupportedRoutes.DISPATCHING}`,
          //   component: DispatchingContainer,
          //   exact: true,
          // },
          // {
          //   path: `${root}${ISupportedRoutes?.INTEGRATIONS}`,
          //   component: Integrations,
          // },
          // {
          //   path: `${root}${ISupportedRoutes?.CALLBACK}`,
          //   component: Integrations,
          // },

          // {
          //   path: `${root}${ISupportedRoutes?.SETTINGS}`,
          //   component: SettingLayout,
          //   routes: SettingRoutes(`${root}${ISupportedRoutes.SETTINGS}`),
          // },
        ],
      },
      {
        path: `/page`,
        component: DefaultLayout,
        routes: [
          {
            exact: true,
            path: `page/components`,
            component: TestComponents,
          },
          {
            path: `/page/login`,
            component: Login,
            exact: true,
          },
          {
            path: `/page/signup`,
            component: Register,
            exact: true,
          },
          {
            path: `/page/organization`,
            component: OrganizationWidget,
            exact: true,
          },
          {
            path: `/page/join-user`,
            component: JoinUser,
            exact: true,
          },
          {
            path: `${ISupportedRoutes.DEFAULT_LAYOUT}${ISupportedRoutes?.FORGOT_PASSWORD}`,
            component: ForgotPassowrdContainer,
            exact: true,
          },
        ],
      },
      {
        path: '/',
        component: RedirectToLogin,
      },
    ],
  },
];
