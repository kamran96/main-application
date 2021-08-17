import React from "react";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";

export const Columns: ColumnsType<any> = [
  { title: "Category", dataIndex: "title", key: "title" },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Created Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (data, row, index) => (
      <>{dayjs(data).format("MM/DD/YYYY h:mm A")}</>
    ),
  },
  // { title: "", render: (data, row, index) => <>delete</> },
];
