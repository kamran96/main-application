import { ITableExportFields } from "ant-table-extensions";

export const _csvColumnsAccount: ITableExportFields = {
  code: "Code",
  name: "Account Head",
  secondary_account: {
    header: "Type",
    formatter: (data) => (data ? data.name : "-"),
  },
  tax_rate: "Tax Rate",
  total_debits: {
    header: "Total Debits",
    formatter: (data) => (data ? data : 0),
  },
  total_credits: {
    header: "Total Credits",
    formatter: (data) => (data ? data : 0),
  },
  balance: {
    header: "Amount",
    formatter: (data) => (data ? data : 0),
  },
};
