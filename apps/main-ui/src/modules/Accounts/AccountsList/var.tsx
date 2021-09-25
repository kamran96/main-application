import { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<any> = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Tax Rate",
    dataIndex: "tax_rate",
    key: "tax_rate",
  },
  {
    title: "TDX",
    dataIndex: "tdx",
    key: "tdx",
  },
];

export const data: any = [
  {
    code: "1",
    name: "Zohaib",
    type: `Revenue`,
    tax_rate: `Tax On Sale`,
    tdx: "0.00",
  },
  {
    code: "1",
    name: "Zohaib",
    type: `Expense`,
    tax_rate: `Tax On Sale`,
    tdx: "0.00",
  },
  {
    code: "1",
    name: "Zohaib",
    type: `Expense`,
    tax_rate: `Tax On Sale`,
    tdx: "0.00",
  },
  {
    code: "1",
    name: "Zohaib",
    type: `Revenue`,
    tax_rate: `Tax On Sale`,
    tdx: "0.00",
  },
];
