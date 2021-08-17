import React from "react";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

export const columns: ColumnsType<any> = [
  {
    title: "Ref",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "From",
    dataIndex: "contact",
    key: "contact",
    render: (data) => {
      return <>{data.name}</>;
    },
  },
  {
    title: "Date",
    dataIndex: "issueDate",
    key: "issueDate",
    render: (date) => {
      return <>{dayjs(date).format("MMM D, YYYY")}</>;
    },
  },
  // {
  //   title: "Due Date",
  //   dataIndex: "dueDate",
  //   key: "dueDate",
  //   render: (date) => {
  //     return <>{dayjs(date).format("MMM D, YYYY")}</>;
  //   },
  // },
  {
    title: "Paid Amount",
    dataIndex: "paid_amount",
    key: "paid_amount",
  },
  {
    title: "Due",
    dataIndex: "due_amount",
    key: "due_amount",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      return (
        <>
          {status === 1
            ? "Paid"
            : status === 2
            ? "Awating Payment"
            : status === 3
            ? "Awating Aproval"
            : "Draft"}
        </>
      );
    },
  },
];
