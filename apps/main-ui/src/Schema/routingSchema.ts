import bxUser from '@iconify-icons/bx/bx-user';
import bookOpen from '@iconify-icons/feather/book-open';
import dollarSign from '@iconify-icons/feather/dollar-sign';
import filePlus from '@iconify-icons/feather/file-plus';
import fileText from '@iconify-icons/feather/file-text';
import layersIcon from '@iconify-icons/feather/layers';
import shoppingCart from '@iconify-icons/icons8/shopping-cart';
import coinsIcon from '@iconify-icons/la/coins';
import fileInvoiceDollar from '@iconify-icons/la/file-invoice-dollar';
import viewDashboardOutline from '@iconify-icons/mdi/view-dashboard';
import analyticsIcon from '@iconify-icons/uil/analytics';
import gitMerge from '@iconify-icons/feather/git-merge';
import bxsReport from '@iconify-icons/bx/bxs-report';
import shoppingBag from '@iconify-icons/fe/shopping-bag';
import slidersIcon from '@iconify-icons/feather/sliders';
import billIcon from '@iconify-icons/uil/bill';

import { IRoutingSchema, ISupportedRoutes } from '../modal';
import { PERMISSIONS } from '../components/Rbac/permissions';

const root = `/app`;
export const RoutingSchema: IRoutingSchema = {
  nestedRoutes: [
    {
      tag: 'Dashboard',
      route: '/app/dashboard',
      children: [],
      icon: viewDashboardOutline,
    },
    {
      tag: 'Business',
      icon: coinsIcon,
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
          tag: 'Purchases',
          permission: PERMISSIONS.PURCHASES_INDEX,
        },
        {
          route: `${root}${ISupportedRoutes.BILLS}`,
          tag: 'Bills',
          // permission: PERMISSIONS.bill,
        },
      ],
    },
    {
      tag: 'Reports',
      icon: bxsReport,
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
      icon: analyticsIcon,
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
      icon: dollarSign,
      route: `${root}${ISupportedRoutes.PAYMENTS}`,
      children: [],
      permission: PERMISSIONS.PAYMENTS_INDEX,
    },

    {
      tag: 'Contact',
      icon: bxUser,
      route: `${root}${ISupportedRoutes.CONTACTS}`,
      children: [],
      permission: PERMISSIONS.CONTACTS_INDEX,
    },
    {
      tag: 'Items',
      route: '/app/items',
      children: [],
      icon: shoppingCart,
      permission: PERMISSIONS.ITEMS_INDEX,
    },
    {
      tag: 'Categories',
      route: `${root}${ISupportedRoutes.Categories}`,
      children: [],
      icon: layersIcon,
      permission: PERMISSIONS.CATEGORIES_INDEX,
    },
    {
      tag: 'Dispatching',
      route: `${root}${ISupportedRoutes.DISPATCHING}`,
      children: [],
      icon: gitMerge,
      permission: 'DISABLED', // MAKE ONCE ITS INTEGRATED IT WILL BE ENABLE
    },
  ],
  singleEntity: [
    {
      route: `${root}${ISupportedRoutes.CREATE_TRANSACTION}`,
      tag: 'Journal Entry',
      icon: filePlus,
      permission: PERMISSIONS.TRANSACTIONS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.CREATE_CONTACT}`,
      tag: 'Create Contact',
      icon: bxUser,
      permission: PERMISSIONS.CONTACTS_CREATE,
    },
    {
      route: root + ISupportedRoutes.CREATE_INVOICE,
      tag: 'Create Invoice',
      icon: fileText,
      permission: PERMISSIONS.INVOICES_CREATE,
    },

    {
      route: `${root}${ISupportedRoutes.CREATE_PURCHASE_ORDER}`,
      tag: 'Create PO',
      icon: bookOpen,
      permission: PERMISSIONS.PURCHASE_ORDERS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.CREATE_PURCHASE_Entry}`,
      tag: 'Create Bill',
      icon: shoppingBag,
    },

    {
      route: `${root}${ISupportedRoutes.CREATE_QUOTE}`,
      tag: 'Create Quote',
      icon: fileInvoiceDollar,
      permission: PERMISSIONS.QUOTATIONS_CREATE,
    },
    {
      route: `${root}${ISupportedRoutes.ADD_CREDIT_NOTE}`,
      tag: 'Credit Note',
      icon: billIcon,
    },
  ],
};
