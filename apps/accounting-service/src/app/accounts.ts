export const primary = [
  {
    name: 'asset',
    code: 10000,
    oldId: '7',
  },
  {
    name: 'expense',
    code: 20000,
    oldId: '11',
  },
  {
    name: 'equity',
    code: 30000,
    oldId: '10',
  },
  {
    name: 'liability',
    code: 40000,
    oldId: '9',
  },
  {
    name: 'revenue',
    code: 50000,
    oldId: '8',
  },
];

export const secondary = [
  {
    name: 'Fixed Asset',
    primary_account_id: '7',
    code: '10000',
    accounts: [],
  },
  {
    name: 'Current Asset',
    primary_account_id: '7',
    code: '15000',
    accounts: [
      {
        name: 'Cash In Hand',
        status: '1',
        code: '15001',
        isSystemAccount: true,
      },
      {
        name: 'Bills Receivable',
        code: '15002',
        isSystemAccount: true,
      },
      {
        name: 'Cash at Bank',
        code: '15003',
        isSystemAccount: true,
      },
      {
        name: 'Cash Receiveable',
        code: '15004',
        isSystemAccount: true,
      },
      {
        name: 'Inventory',
        code: '15005',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Indirect Expense',
    code: '25000',
    primary_account_id: '11',
    accounts: [
      {
        name: 'Office Expense',
        code: '25001',
        isSystemAccount: true,
      },
      {
        name: 'Employees Salary',
        code: '25002',
        isSystemAccount: true,
      },
      {
        name: 'Telephone Expense',
        code: '25003',
        isSystemAccount: true,
      },
      {
        name: 'Depreciation',
        code: '25004',
        isSystemAccount: true,
      },
      {
        name: 'Discount (Dr) / Discount Allowed',
        code: '25005',
        isSystemAccount: true,
      },
      {
        name: 'Donation',
        code: '25006',
        isSystemAccount: true,
      },
      {
        name: 'Electricity Expenses',
        code: '25007',
        isSystemAccount: true,
      },
      {
        name: 'Export Duty',
        code: '25008',
        isSystemAccount: true,
      },
      {
        name: 'Freight on Sale (Freight Outward)',
        code: '25009',
        isSystemAccount: true,
      },
      {
        name: 'Freight Outward',
        code: '25010',
        isSystemAccount: true,
      },
      {
        name: 'Interest (Dr.)',
        code: '25011',
        isSystemAccount: true,
      },
      {
        name: 'Miscellaneous Expenses',
        code: '25012',
        isSystemAccount: true,
      },
      {
        name: 'Office Expenses',
        code: '25013',
        isSystemAccount: true,
      },
      {
        name: 'Printing & Advertisement',
        code: '25014',
        isSystemAccount: true,
      },
      {
        name: 'Printing & Stationery',
        code: '25015',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Direct Expense',
    code: '20000',
    primary_account_id: '11',
    accounts: [
      {
        name: 'Import Duty',
        code: '20001',
        isSystemAccount: true,
      },
      {
        name: 'Discount On Sales',
        code: '20002',
        isSystemAccount: true,
      },
      {
        name: 'Cost of Goods Sold',
        code: '20003',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Fixed Liability',
    status: '1',
    primary_account_id: '9',
    code: '45000',
    accounts: [],
  },
  {
    name: 'Current Liability',
    primary_account_id: '9',
    code: '40000',
    accounts: [
      {
        name: 'Bills Payable',
        code: '40001',
        isSystemAccount: true,
      },
      {
        name: 'Capital',
        code: '40002',
        isSystemAccount: true,
      },
      {
        name: 'Purchase Payable',
        code: '40003',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Direct Income',
    primary_account_id: '8',
    code: '50000',
    accounts: [
      {
        name: 'Sales',
        code: '50001',
        isSystemAccount: true,
      },
      {
        name: 'Supplier Other Income',
        code: '50002',
        isSystemAccount: true,
      },
      {
        name: 'Discount On Purchase',
        code: '50003',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Indirect Income',
    primary_account_id: '8',
    code: '55000',
    accounts: [
      {
        name: 'Commission (Cr.) / Commission Received',
        code: '55001',
        isSystemAccount: true,
      },
      {
        name: 'Discount (Cr.) / Discount Received',
        code: '55002',
        isSystemAccount: true,
      },
      {
        name: 'Miscellaneous Income',
        isSystemAccount: true,
        code: '55003',
      },
    ],
  },
  {
    name: "Owner's Equity",
    primary_account_id: '10',
    code: '30000',
    accounts: [],
  },
];
