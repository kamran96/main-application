export interface IRoutingSchema {
  nestedRoutes: IRoutesSchema[];
  singleEntity: IRouteChildren[];
}

export interface IRoutesSchema {
  tag?: string;
  children?: IRoutesSchema[];
  route?: string;
  break?: boolean;
  icon?: any;
  permission?: string;
}

export interface IRouteChildren {
  route?: string;
  tag?: string;
  break?: boolean;
  icon?: any;
  permission?: string;
  children?: IRouteChildren[];
}

export enum ISupportedRoutes {
  DASHBOARD_LAYOUT = '/app',
  DASHBOARD = '/dashboard',
  DEFAULT_LAYOUT = '/page',
  CONTACTS = '/contacts',
  CONTACTS_IMPORT = '/contacts-import',
  CREATE_CONTACT = '/create-contact',
  UPDATE_CONTACT = '/update-contact',
  USERS = '/users',
  CREATE_USERS = '/users-create',
  PROFILE_SETTING = '/profile-settings',
  PREFERENCES_SETTINGS = '/settings-preferences',
  ACCOUNT_SETTING = '/account-settings',
  INVOICES = '/invoices',
  INVOICES_VIEW = '/invoice',
  CREATE_INVOICE = '/invoice-create',
  PURCHASE_ORDER = '/purchase-orders',
  PURCHASES = '/bills',
  CREATE_PURCHASE_ORDER = '/create-order',
  CREATE_PURCHASE_Entry = '/create-bill',
  ACCOUNTS = '/accounts',
  TRANSACTIONS = `/journal`,
  CREATE_TRANSACTION = `/journal-entry`,
  QUOTE = `/quotes`,
  CREATE_BILL = `/create-bill`,
  BILLS = `/bills`,
  CREATE_QUOTE = `/create-quote`,
  ACCOUNTS_LEDGER = `/accounts-ledger`,
  BANK_ACCOUNTS = `/bankaccounts`,
  TRIAL_BALANCE = `/trial-balance`,
  BALANCE_SHEET = `/balancesheet`,
  INCOME_STATEMENT = `/income-statement`,
  CASH_ACTIVITY_REPORT = `/cash-activity-report`,
  CASH_FLOW_STATEMENT = `/cashflow-statement`,
  PAYMENTS = `/payments`,
  PAYMENTS_RECEIVABLES = `/payment-receivables `,
  PAYMENT_PAYABLES = `/payment-payables `,
  Categories = `/categories`,
  Organizations = `/organizations`,
  ITEMS = `/items`,
  INVOICE_DASHBOARD = `/invoice-dashboard`,
  DISPATCHING = `/dispatching`,
  RBAC = `/roles`,
  PERMISSIONS = `/premissions`,
  PERMISSION_SETTINGS = `/premissions-settings`,
  PERMISSION_DENIED = `/405`,
  INTEGRATIONS = `/integrations`,
  CALLBACK = '/callback',
  SETTINGS = '/settings',
  ADD_CREDIT_NOTE = `/add-credit-note`,
  ADD_DEBIT_NOTE = `/add-debit-note`,
  CREDIT_NOTES = '/credit-notes',
  VERIFY_USER = ' /user',
  TAX = '/tax',
  INVENTORY_MANAGEMENT = '/inventory-management',
  FORGOT_PASSWORD = `/forgot-password`,
  LOGIN = `/login`,
  SIGNUP = `/signup`,
  BANK_RECONSILATION = '/bank-reconcilation',
}
