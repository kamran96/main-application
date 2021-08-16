import React from "react";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ISupportedRoutes } from "../../../../modal";

export const QuoteColumns: ColumnsType<any> = [
  {
    title: "Number",
    dataIndex: "invoiceNumber",
    key: "invoiceNumber",
    render: (data, row) => (
      <Link to={`/app${ISupportedRoutes.QUOTE}/${row.id}`}>{data}</Link>
    ),
  },
  {
    title: "Ref",
    dataIndex: "reference",
    key: "reference",
  },
  {
    title: "Customer",
    dataIndex: "contact",
    key: "contact",
    render: (data, row, index) => <>{(data && data.name) || "-"}</>,
  },

  {
    title: "Date",
    dataIndex: "issueDate",
    key: "issueDate",
    render: (data, row, index) => (
      <>{dayjs(data).format(`MMMM D, YYYY h:mm A`)}</>
    ),
  },
  {
    title: "Items",
    dataIndex: "invoice_items",
    key: "invoice_items",
    render: (data: any[]) => (
      <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
    ),
  },
  {
    title: "Amount",
    dataIndex: "netTotal",
    key: "netTotal",
  },
];
