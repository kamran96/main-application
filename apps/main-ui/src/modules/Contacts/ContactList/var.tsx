import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

import { Color } from "../../../modal";

export const columns: ColumnsType<any> = [
  {
    title: "Contact",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "You Owe Them",
    dataIndex: "employes",
    key: "employes",
    render: (employees) => {
      return (
        <>
          {employees.map((name) => {
            return (
              <Tag color={Color.$PRIMARY} key={name}>
                {name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      );
    },
  },
  {
    title: "They Owe you",
    dataIndex: "supervisors",
    key: "supervisors",
    render: (supervisors) => {
      return (
        <>
          {supervisors.map((name) => {
            return (
              <Tag color={Color.$LOGO} key={name}>
                {name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      );
    },
  },
];

export const data: any = [
  {
    key: "1",
    name: "John Brown",
    email: "test@testing.com",
    employes: ["Qasim", "Ali", "Nadeem"],
    supervisors: ["Ejaz", "Masroor"],
  },
  {
    key: "2",
    name: "John Brown",
    email: "test@testing.com",
    employes: ["Qasim", "Ali", "Nadeem"],
    supervisors: ["Ejaz", "Masroor"],
  },
  {
    key: "3",
    name: "John Brown",
    email: "test@testing.com",
    employes: ["Qasim", "Ali", "Nadeem"],
    supervisors: ["Ejaz", "Masroor"],
  },
  {
    key: "4",
    name: "John Brown",
    email: "test@testing.com",
    employes: ["Qasim", "Ali", "Nadeem"],
    supervisors: ["Ejaz", "Masroor"],
  },
];
