import { ColumnsType } from "antd/es/table";
import React from "react";

import { dayjs } from "../../../../utils/dayjs";

export const columns: ColumnsType<any> = [
  {
    title: "Ref",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "From",
    dataIndex: "sent_by",
    key: "sent_by",
  },
  {
    title: "Date",
    dataIndex: "issue_date",
    key: "issue_date",
  },
  {
    title: "Due Date",
    dataIndex: "due_date",
    key: "due_date",
  },
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

export const data: any = [
  {
    key: "1",
    sent_by: "Zohaib",
    issue_date: `${dayjs().format("DD-MM-YYYY")}`,
    due_date: `${dayjs().format("DD-MM-YYYY")}`,
    paid_amount: "test@testing.com",
    due_amount: "1000",
    status: 4,
  },
  {
    key: "2",
    sent_by: "Amjad",
    issue_date: `${dayjs().format("DD-MM-YYYY")}`,
    due_date: `${dayjs().format("DD-MM-YYYY")}`,
    paid_amount: "test@testing.com",
    due_amount: "1000",
    status: 3,
  },
  {
    key: "3",
    sent_by: "Ali",
    issue_date: `${dayjs().format("DD-MM-YYYY")}`,
    due_date: `${dayjs().format("DD-MM-YYYY")}`,
    paid_amount: "test@testing.com",
    due_amount: "1000",
    status: 2,
  },
  {
    key: "4",
    sent_by: "Ejaz",
    issue_date: `${dayjs().format("DD-MM-YYYY")}`,
    due_date: `${dayjs().format("DD-MM-YYYY")}`,
    paid_amount: "test@testing.com",
    due_amount: "1000",
    status: 1,
  },
];
