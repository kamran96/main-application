export const roles = [
  { name: 'admin', parent: null },
  { name: 'manager', parent: 'admin' },
  { name: 'sales-man', parent: 'manager' },
];

export const permissions = [
  // account modules relation permissions
  {
    title: 'index',
    description: 'to list all accounts against branch and tenant',
    module: 'accounts',
    roles: ['manager'],
  },
  {
    title: 'ledger',
    description: 'to view single account history',
    module: 'accounts',
    roles: ['manager'],
  },
  {
    title: 'create',
    description: 'endpoint to create account head in chart of account',
    module: 'accounts',
    roles: ['manager'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete account head',
    module: 'accounts',
    roles: ['manager'],
  },
  // transaction module related permissions
  {
    title: 'create',
    description: 'endpoint to create transaction',
    module: 'transactions',
    roles: ['manager'],
  },
  {
    title: 'index',
    description: 'endpoint to list all transactions',
    module: 'transactions',
    roles: ['manager'],
  },
  {
    title: 'show',
    description: 'endpoint to show specific/particular transactions',
    module: 'transactions',
    roles: ['manager'],
  },
  // user module related permissions
  {
    title: 'list',
    description: 'endpoint to list all users',
    module: 'users',
    roles: ['manager'],
  },
  {
    title: 'create',
    description: 'endpoint to create users',
    module: 'users',
    roles: ['admin'],
  },
  {
    title: 'show',
    description: 'endpoint to show users agianst id',
    module: 'users',
    roles: ['admin'],
  },
  // contact module related permissions
  {
    title: 'index',
    description: 'endpoint to list all contacts',
    module: 'contacts',
    roles: ['sales-man'],
  },
  {
    title: 'ledger',
    description: 'endpoint to view all contacts related history',
    module: 'contacts',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create contacts',
    module: 'contacts',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete contact',
    module: 'contacts',
    roles: ['manager'],
  },
  // payment module related permissions
  {
    title: 'index',
    description: 'endpoint to list all payments',
    module: 'payments',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create payments',
    module: 'payments',
    roles: ['sales-man'],
  },
  {
    title: 'show',
    description: 'endpoint to show payment against specific id',
    module: 'payments',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete payment against specific id',
    module: 'payments',
    roles: ['manager'],
  },
  // item module related permissions
  {
    title: 'index',
    description: 'endpoint to list all items',
    module: 'items',
    roles: ['sales-man'],
  },
  {
    title: 'show',
    description: 'endpoint to list all item related data',
    module: 'items',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create items',
    module: 'items',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete item',
    module: 'items',
    roles: ['manager'],
  },
  // category module related permissions
  {
    title: 'index',
    description: 'endpoint to list all categories',
    module: 'categories',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create category',
    module: 'categories',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete category',
    module: 'categories',
    roles: ['manager'],
  },
  // purchases module related permissions
  {
    title: 'index',
    description: 'endpoint to index purchase',
    module: 'purchases',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create purchase',
    module: 'purchases',
    roles: ['sales-man'],
  },
  {
    title: 'show',
    description: 'endpoint to show purchase',
    module: 'purchases',
    roles: ['sales-man'],
  },
  {
    title: 'draft-approve',
    description: 'endpoint to draft-approve purchase',
    module: 'purchases',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete purchase',
    module: 'purchases',
    roles: ['manager'],
  },
  // purchase orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index PO',
    module: 'purchase-orders',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create PO',
    module: 'purchase-orders',
    roles: ['sales-man'],
  },
  {
    title: 'show',
    description: 'endpoint to show PO',
    module: 'purchase-orders',
    roles: ['sales-man'],
  },
  {
    title: 'approve',
    description: 'endpoint to approve PO',
    module: 'purchase-orders',
    roles: ['sales-man'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete PO',
    module: 'purchase-orders',
    roles: ['sales-man'],
  },
  // invoices orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index invoice',
    module: 'invoices',
    roles: ['sales-man'],
  },
  {
    title: 'create',
    description: 'endpoint to create invoice',
    module: 'invoices',
    roles: ['sales-man'],
  },
  {
    title: 'create-pdf',
    description: 'endpoint to create-pdf invoice',
    module: 'invoices',
    roles: ['sales-man'],
  },
  {
    title: 'show',
    description: 'endpoint to show invoice',
    module: 'invoices',
    roles: ['sales-man'],
  },
  {
    title: 'draft-approve',
    description: 'endpoint to draft-approve invoice',
    module: 'invoices',
    roles: ['manager'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete invoice',
    module: 'invoices',
    roles: ['manager'],
  },
  // organizations orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index organization',
    module: 'organizations',
    roles: ['admin'],
  },
  {
    title: 'create',
    description: 'endpoint to create organization',
    module: 'organizations',
    roles: ['admin'],
  },
  {
    title: 'show',
    description: 'endpoint to show organization',
    module: 'organizations',
    roles: ['admin'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete organization',
    module: 'organizations',
    roles: ['admin'],
  },
  // branches orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index branch',
    module: 'branches',
    roles: ['admin'],
  },
  {
    title: 'create',
    description: 'endpoint to create branch',
    module: 'branches',
    roles: ['admin'],
  },
  {
    title: 'show',
    description: 'endpoint to show branch',
    module: 'branches',
    roles: ['admin'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete branch',
    module: 'branches',
    roles: ['admin'],
  },
  // Banks orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index bank',
    module: 'banks',
    roles: ['manager'],
  },
  {
    title: 'create',
    description: 'endpoint to create bank',
    module: 'banks',
    roles: ['manager'],
  },
  // rbac orders module related permissions
  {
    title: 'role-permission-index',
    description: 'endpoint to list role-permissions',
    module: 'rbac',
    roles: ['admin'],
  },
  {
    title: 'role-index',
    description: 'endpoint to list roles',
    module: 'rbac',
    roles: ['admin'],
  },
  {
    title: 'role-create',
    description: 'endpoint to create role',
    module: 'rbac',
    roles: ['admin'],
  },
  {
    title: 'role-permission-update',
    description: 'endpoint to update role-permission for user',
    module: 'rbac',
    roles: ['admin'],
  },
  {
    title: 'role-delete',
    description: 'endpoint to delete role',
    module: 'rbac',
    roles: ['admin'],
  },
  // rbac orders module related permissions
  {
    title: 'index',
    description: 'endpoint to index quotation',
    module: 'quotations',
    roles: ['manager'],
  },
  {
    title: 'create',
    description: 'endpoint to create quotation',
    module: 'quotations',
    roles: ['manager'],
  },
  {
    title: 'show',
    description: 'endpoint to show quotation',
    module: 'quotations',
    roles: ['manager'],
  },
  {
    title: 'delete',
    description: 'endpoint to delete quotation',
    module: 'quotations',
    roles: ['manager'],
  },
];
