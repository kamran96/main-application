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
    code: '10000',
    primary_account_id: '7',
    accounts: [
      {
        name: 'Land',
        code: '10001',
        isSystemAccount: true,
      },
      {
        name: 'Building',
        code: '10002',
        isSystemAccount: true,
      },
      {
        name: 'Accumulated Depreciation-building',
        code: '10003',
        isSystemAccount: true,
      },
      {
        name: 'Equipment',
        code: '10004',
        isSystemAccount: true,
      },
      {
        name: 'Accumulated Depreciation-equipment',
        code: '10005',
        isSystemAccount: true,
      },
      {
        name: 'Vehicle',
        code: '10006',
        isSystemAccount: true,
      },
      {
        name: 'Accumulated Depreciation-vehicle',
        code: '10007',
        isSystemAccount: true,
      },
      {
        name: 'Furniture & Fixture',
        code: '10008',
        isSystemAccount: true,
      },
      {
        name: 'Accumulated Depreciation-furniture & Fixture',
        code: '10009',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Current Asset',
    primary_account_id: '7',
    code: '15000',
    accounts: [
      {
        name: 'Cash In Hand',
        code: '15001',
        isSystemAccount: true,
      },
      {
        name: 'Account Receivable',
        code: '15002',
        isSystemAccount: true,
      },
      {
        name: 'Cash at Bank',
        code: '15003',
        isSystemAccount: true,
      },
      {
        name: 'Inventory',
        code: '15004',
        isSystemAccount: true,
      },
      {
        name: 'Prepaid Expense',
        code: '15005',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Expense',
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
      {
        name: 'Depreciation',
        code: '20004',
        isSystemAccount: true,
      },
      {
        name: 'Discount (Dr) / Discount Allowed',
        code: '20005',
        isSystemAccount: true,
      },
      {
        name: 'Donation',
        code: '20006',
        isSystemAccount: true,
      },
      {
        name: 'Electricity Expenses',
        code: '20007',
        isSystemAccount: true,
      },
      {
        name: 'Export Duty',
        code: '20008',
        isSystemAccount: true,
      },
      {
        name: 'Interest',
        code: '20009',
        isSystemAccount: true,
      },
      {
        name: 'Miscellaneous Expenses',
        code: '20010',
        isSystemAccount: true,
      },
      {
        name: 'Office Expenses',
        code: '20011',
        isSystemAccount: true,
      },
      {
        name: 'Stationery',
        code: '20012',
        isSystemAccount: true,
      },
      {
        name: 'Bank Charges',
        code: '20013',
        isSystemAccount: true,
      },
      {
        name: 'Bad Debts',
        code: '20014',
        isSystemAccount: true,
      },
      {
        name: 'Wages',
        code: '20015',
        isSystemAccount: true,
      },
      {
        name: 'Salaries',
        code: '20016',
        isSystemAccount: true,
      },
      {
        name: 'Utilities',
        code: '20017',
        isSystemAccount: true,
      },
      {
        name: 'Rent',
        code: '20018',
        isSystemAccount: true,
      },
      {
        name: 'Bonus and Employee Incentives',
        code: '20019',
        isSystemAccount: true,
      },
      {
        name: 'Insurance',
        code: '20020',
        isSystemAccount: true,
      },
      {
        name: 'Fuel',
        code: '20021',
        isSystemAccount: true,
      },
      {
        name: 'Repair & Maintainance',
        code: '20022',
        isSystemAccount: true,
      },
      {
        name: 'Telephone Charges',
        code: '20023',
        isSystemAccount: true,
      },
      {
        name: 'Supplies Expense',
        code: '20024',
        isSystemAccount: true,
      },
      {
        name: 'Meals & Entertainment',
        code: '20025',
        isSystemAccount: true,
      },
      {
        name: 'Travel Expenses',
        code: '20026',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Long-term Liability',
    code: '45000',
    primary_account_id: '9',
    accounts: [
      {
        name: 'Bonds Payable',
        code: '45001',
        isSystemAccount: true,
      },
      {
        name: 'Long-term Debt',
        code: '45002',
        isSystemAccount: true,
      },
      {
        name: 'Deferred Revenue',
        code: '45003',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Current Liability',
    code: '40000',
    primary_account_id: '9',
    accounts: [
      {
        name: 'Account Payable',
        code: '40001',
        isSystemAccount: true,
      },
      {
        name: 'Unearned Revenue',
        code: '40002',
        isSystemAccount: true,
      },
      {
        name: 'Current Portion of Longterm Debt',
        code: '40003',
        isSystemAccount: true,
      },
      {
        name: 'Interest Payable',
        code: '40004',
        isSystemAccount: true,
      },
      {
        name: 'Salaries Payable',
        code: '40005',
        isSystemAccount: true,
      },
      {
        name: 'Taxes Payable',
        code: '40006',
        isSystemAccount: true,
      },
      {
        name: 'Accrued Payable',
        code: '40007',
        isSystemAccount: true,
      },
      {
        name: 'Dividend Payable',
        code: '40008',
        isSystemAccount: true,
      },
    ],
  },
  {
    name: 'Revenue',
    code: '50000',
    primary_account_id: '8',
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
      {
        name: 'Discount (Cr.) / Discount Received',
        code: '50004',
        isSystemAccount: true,
      },
      {
        name: 'Miscellaneous Income',
        isSystemAccount: true,
        code: '50005',
      },
      {
        name: 'Investment Income',
        isSystemAccount: true,
        code: '50006',
      },
      {
        name: 'Fess Earned',
        isSystemAccount: true,
        code: '50007',
      },
      {
        name: 'Commission',
        isSystemAccount: true,
        code: '50008',
      },
    ],
  },
  {
    name: 'Equity',
    code: '30000',
    primary_account_id: '10',
    accounts: [
      {
        name: 'Share Capital',
        code: '30001',
        isSystemAccount: true,
      },
      {
        name: 'Retained Earnings',
        code: '30002',
        isSystemAccount: true,
      },
      {
        name: 'General Reserves / Other Reserves',
        code: '30003',
        isSystemAccount: true,
      },
    ],
  },
];
