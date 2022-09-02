import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { LightColors } from '../../../hooks/useTheme/themeColors';
import React from 'react';

export const columns: ColumnsType<any> = [
  {
    title: 'Contact',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'You Owe Them',
    dataIndex: 'employes',
    key: 'employes',
    render: (employees) => {
      return (
        <>
          {employees.map((name) => {
            return (
              <Tag color={LightColors.$PRIMARY} key={name}>
                {name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      );
    },
  },
  {
    title: 'They Owe you',
    dataIndex: 'supervisors',
    key: 'supervisors',
    render: (supervisors) => {
      return (
        <>
          {supervisors.map((name) => {
            return (
              <Tag color={LightColors?.$LOGO} key={name}>
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
    key: '1',
    name: 'John Brown',
    email: 'test@testing.com',
    employes: ['Qasim', 'Ali', 'Nadeem'],
    supervisors: ['Ejaz', 'Masroor'],
  },
  {
    key: '2',
    name: 'John Brown',
    email: 'test@testing.com',
    employes: ['Qasim', 'Ali', 'Nadeem'],
    supervisors: ['Ejaz', 'Masroor'],
  },
  {
    key: '3',
    name: 'John Brown',
    email: 'test@testing.com',
    employes: ['Qasim', 'Ali', 'Nadeem'],
    supervisors: ['Ejaz', 'Masroor'],
  },
  {
    key: '4',
    name: 'John Brown',
    email: 'test@testing.com',
    employes: ['Qasim', 'Ali', 'Nadeem'],
    supervisors: ['Ejaz', 'Masroor'],
  },
];
