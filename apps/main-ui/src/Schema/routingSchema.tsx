import {
  IContactTypes,
  IInvoiceStatus,
  INVOICETYPE,
  INVOICE_TYPE_STRINGS,
  IRoutingSchema,
  ISupportedRoutes,
  ORDER_TYPE,
  ReactQueryKeys,
  TRANSACTION_MODE,
} from '@invyce/shared/types';
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
import { getContacts, getItemsList, paymentIndexAPI } from '@api';
import { getInvoiceListAPI } from '@api';
import { getCreditNotes } from '@api';

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
        // {
        //   route: `${root}${ISupportedRoutes.INVOICE_DASHBOARD}`,
        //   tag: 'Invoice Dashboard',
        // },
        {
          route: `${root}${ISupportedRoutes.INVOICES}`,
          tag: 'Invoices',
          permission: PERMISSIONS.INVOICES_INDEX,
          prefetchQueries: [
            {
              fn: getInvoiceListAPI,
              queryKey: [
                ReactQueryKeys?.INVOICES_KEYS,
                ORDER_TYPE?.SALE_INVOICE,
                IInvoiceStatus?.approve,
                'All',
                1,
                20,
                '',
                'id',
              ],
            },
            {
              fn: getInvoiceListAPI,
              queryKey: [
                ReactQueryKeys?.INVOICES_KEYS,
                ORDER_TYPE?.SALE_INVOICE,
                IInvoiceStatus?.approve,
                'AWAITING_PAYMENT',
                1,
                20,
                '',
                'id',
              ],
            },
            {
              fn: getInvoiceListAPI,
              queryKey: [
                ReactQueryKeys?.INVOICES_KEYS,
                ORDER_TYPE?.SALE_INVOICE,
                IInvoiceStatus?.draft,
                'ALL',
                1,
                20,
                '',
                'id',
              ],
            },
            {
              fn: getInvoiceListAPI,
              queryKey: [
                ReactQueryKeys?.INVOICES_KEYS,
                ORDER_TYPE?.SALE_INVOICE,
                INVOICETYPE.Approved,
                INVOICE_TYPE_STRINGS.Date_Expired,
                1,
                20,
                '',
                'id',
              ],
            },
            {
              fn: getInvoiceListAPI,
              queryKey: [
                ReactQueryKeys?.INVOICES_KEYS,
                ORDER_TYPE.SALE_INVOICE,
                INVOICETYPE.Approved,
                'PAID ',
                1,
                20,
                '',
                'id',
              ],
            },
          ],
          fn: getInvoiceListAPI,
          queryKey: [
            ReactQueryKeys?.INVOICES_KEYS,
            ORDER_TYPE?.SALE_INVOICE,
            IInvoiceStatus?.approve,
            'All',
            1,
            20,
            '',
            'id',
          ],
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
        // {
        //   route: '/app/quotes',
        //   tag: 'Quotes',
        //   permission: PERMISSIONS.QUOTATIONS_INDEX,
        // },
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
        // {
        //   route: `${root}${ISupportedRoutes.CASH_ACTIVITY_REPORT}`,
        //   tag: 'Cash Activity Report',
        // },
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
      prefetchQueries: [
        {
          fn: paymentIndexAPI,
          queryKey: [
            ReactQueryKeys.PAYMENTS_KEYS,
            1,
            'id',
            20,
            '',
            TRANSACTION_MODE?.PAYABLES,
          ],
        },
        {
          fn: paymentIndexAPI,
          queryKey: [
            ReactQueryKeys.PAYMENTS_KEYS,
            1,
            'id',
            20,
            '',
            TRANSACTION_MODE?.RECEIVABLES,
          ],
        },
      ],
      fn: paymentIndexAPI,
      queryKey: [
        ReactQueryKeys.PAYMENTS_KEYS,
        1,
        'id',
        20,
        '',
        TRANSACTION_MODE?.PAYABLES,
      ],
    },

    {
      tag: 'Contact',
      icon: <Contacts />,
      route: `${root}${ISupportedRoutes.CONTACTS}`,
      children: [],
      permission: PERMISSIONS.CONTACTS_INDEX,
      prefetchQueries: [
        {
          fn: getContacts,
          queryKey: [
            ReactQueryKeys.CONTACTS_KEYS,
            IContactTypes.CUSTOMER,
            1,
            'id',
            20,
            '',
          ],
        },
        {
          fn: getContacts,
          queryKey: [
            ReactQueryKeys.CONTACTS_KEYS,
            IContactTypes.SUPPLIER,
            1,
            'id',
            20,
            '',
          ],
        },
      ],
      fn: getContacts,
      queryKey: [
        ReactQueryKeys.CONTACTS_KEYS,
        IContactTypes.CUSTOMER,
        1,
        'id',
        20,
        '',
      ],
    },
    {
      tag: 'Items',
      // route: '/app/items',
      route: `${root}${ISupportedRoutes?.ITEMS}`,
      children: [],
      icon: <Items />,
      permission: PERMISSIONS.ITEMS_INDEX,
      prefetchQueries: [
        {
          fn: getItemsList,
          queryKey: [ReactQueryKeys.ITEMS_KEYS, 1, 'id', '', 20],
        },
      ],
      fn: getItemsList,
      queryKey: [ReactQueryKeys.ITEMS_KEYS, 1, 'id', '', 20],
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

    // {
    //   route: `${root}${ISupportedRoutes.CREATE_QUOTE}`,
    //   tag: 'Create Quote',
    //   icon: <CreateQuote />,
    //   permission: PERMISSIONS.QUOTATIONS_CREATE,
    // },
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
