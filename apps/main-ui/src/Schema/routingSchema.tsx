import { IRoutingSchema, ISupportedRoutes } from '../modal';
import { PERMISSIONS } from '../components/Rbac/permissions';
import {
  BussinesIcon,
  ReportIcon,
  Accounting,
  Payments,
  Contacts,
  Items,
  CreateNote,
  CreateQuote,
  CreateBill,
  CreatePo,
  CreateInvoice,
  CreateContact,
  JournalEntry,
  Dashboard,
  DebitNote,
} from '../assets/icons/index';

const root = `/app`;
export const RoutingSchema: IRoutingSchema = {
  nestedRoutes: [
    {
      tag: 'Dashboard',
      route: '/app/dashboard',
      children: [],
      icon: <Dashboard />,
    },
    // {
    //   tag: 'Banking',
    //   route: `/app${ISupportedRoutes?.BANK_RECONSILATION}`,
    //   children: [],
    //   icon: viewDashboardOutline,
    // },
    {
      tag: 'Business',
      icon: <BussinesIcon />,
      children: [
        {
          route: `${root}${ISupportedRoutes.INVOICE_DASHBOARD}`,
          tag: 'Invoice Dashboard',
        },
        {
          route: `${root}${ISupportedRoutes.INVOICES}`,
          tag: 'Invoices',
          permission: PERMISSIONS.INVOICES_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.CREDIT_NOTES}`,
          tag: 'Credit Notes',
          permission: PERMISSIONS.INVOICES_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.DEBIT_NOTES}`,
          tag: 'Debit Notes',
          permission: PERMISSIONS.INVOICES_INDEX,
        },
        {
          route: '/app/quotes',
          tag: 'Quotes',
          permission: PERMISSIONS.QUOTATIONS_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.PURCHASE_ORDER}`,
          tag: 'Purchase Order',
          permission: PERMISSIONS.PURCHASE_ORDERS_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.PURCHASES}`,
          tag: 'Bills',
          permission: PERMISSIONS.PURCHASES_INDEX,
        },
      ],
    },
    {
      tag: 'Reports',
      icon: <ReportIcon />,
      children: [
        {
          route: `${root}${ISupportedRoutes.TRIAL_BALANCE}`,
          tag: 'Trial Balance',
        },
        {
          route: `${root}${ISupportedRoutes.BALANCE_SHEET}`,
          tag: 'Balancesheet',
        },
        {
          route: `${root}${ISupportedRoutes.INCOME_STATEMENT}`,
          tag: 'Income Statement',
        },
        {
          route: `${root}${ISupportedRoutes.CASH_ACTIVITY_REPORT}`,
          tag: 'Cash Activity Report',
        },
      ],
    },
    {
      tag: 'Accounting',
      icon: <Accounting />,
      children: [
        {
          route: `${root}${ISupportedRoutes.ACCOUNTS}`,
          tag: 'Chart of Accounts',
          permission: PERMISSIONS.ACCOUNTS_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.TRANSACTIONS}`,
          tag: 'Journal Entries',
          break: true,
          permission: PERMISSIONS.TRANSACTIONS_INDEX,
        },

        {
          route: `${root}${ISupportedRoutes.BANK_ACCOUNTS}`,
          tag: 'Bank Accounts',
          permission: PERMISSIONS.BANKS_INDEX,
        },
        // {
        //   route: `${root}${ISupportedRoutes.INCOME_STATEMENT}`,
        //   tag: "Income Statement",
        // },
        // {
        //   route: `${root}${ISupportedRoutes.CASH_FLOW_STATEMENT}`,
        //   tag: "Cash Flow Statement",
        // },
      ],
    },
    {
      tag: 'Payments',
      icon: <Payments />,
      route: `${root}${ISupportedRoutes.PAYMENTS}`,
      children: [],
      permission: PERMISSIONS.PAYMENTS_INDEX,
    },

    {
      tag: 'Contact',
      icon: <Contacts />,
      route: `${root}${ISupportedRoutes.CONTACTS}`,
      children: [],
      permission: PERMISSIONS.CONTACTS_INDEX,
    },
    {
      tag: 'Items',
      route: '/app/items',
      children: [],
      icon: <Items />,
      permission: PERMISSIONS.ITEMS_INDEX,
    },

    //**** Un Comment to enable Categories in sidebar */

    // {
    //   tag: 'Categories',
    //   route: `${root}${ISupportedRoutes.Categories}`,
    //   children: [],
    //   icon: layersIcon,
    //   permission: PERMISSIONS.CATEGORIES_INDEX,
    // },
    {
      tag: 'Dispatching',
      route: `${root}${ISupportedRoutes.DISPATCHING}`,
      children: [],
      icon: <Items />,
      permission: 'DISABLED', // MAKE ONCE ITS INTEGRATED IT WILL BE ENABLE
    },
  ],
  singleEntity: [
    {
      route: `${root}${ISupportedRoutes.CREATE_TRANSACTION}`,
      tag: 'Journal Entry',
      icon: <JournalEntry />,
      permission: PERMISSIONS.TRANSACTIONS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.CREATE_CONTACT}`,
      tag: 'Create Contact',
      icon: <CreateContact />,
      permission: PERMISSIONS.CONTACTS_CREATE,
    },
    {
      route: root + ISupportedRoutes.CREATE_INVOICE,
      tag: 'Create Invoice',
      icon: <CreateInvoice />,
      permission: PERMISSIONS.INVOICES_CREATE,
    },

    {
      route: `${root}${ISupportedRoutes.CREATE_PURCHASE_ORDER}`,
      tag: 'Create PO',
      icon: <CreatePo />,
      permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.CREATE_PURCHASE_Entry}`,
      tag: 'Create Bill',
      icon: <CreateBill />,
    },

    {
      route: `${root}${ISupportedRoutes.CREATE_QUOTE}`,
      tag: 'Create Quote',
      icon: <CreateQuote />,
      permission: PERMISSIONS.QUOTATIONS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.ADD_CREDIT_NOTE}`,
      tag: 'Credit Note',
      icon: <CreateNote />,
    },
    {
      route: `${root}${ISupportedRoutes.ADD_DEBIT_NOTE}`,
      tag: 'Debit Note',
      icon: <DebitNote />,
    },
  ],
};
