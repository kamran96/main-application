/* eslint-disable array-callback-return */
import React from 'react';
import { Select } from 'antd';
import dayjs from 'dayjs';
import moneyFormat from '../../../utils/moneyFormat';
import Icon from '@iconify/react';
import convertToRem from '../../../utils/convertToRem';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ColumnsType } from 'antd/lib/table';
import { IInvoiceResult } from '../../../modal/invoice';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
const { Option } = Select;

export default function (
  state: any[],
  setState: (payload: any) => void,
  contactInvoices: IInvoiceResult[]
) {
  const getContactInvById = (id: number | string) => {
    if (contactInvoices && contactInvoices.length) {
      const [filtered] = contactInvoices.filter((inv) => inv.id === id);
      return filtered;
    } else {
      return null;
    }
  };

  const { Colors } = useGlobalContext();

  const columns: ColumnsType<any> = [
    {
      title: '#',
      width: 30,
      render: (data: any, row: IInvoiceResult, index: number) => (
        <>{index + 1}</>
      ),
    },
    {
      title: 'Invoice no',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (data: any, row: IInvoiceResult, index: number) => {
        return (
          <Select
            className="border-less-select"
            size="middle"
            value={{
              value: data !== null ? data : '',
              label: `${
                data !== null && contactInvoices.length
                  ? contactInvoices &&
                    getContactInvById(data) &&
                    `${getContactInvById(data).invoiceNumber}`
                  : 'Select Item'
              }`,
            }}
            onChange={(itemObj) => {
              const [filtered] = contactInvoices.filter(
                (item) => item.id === itemObj.value
              );

              const allData = [...state];
              allData[index] = filtered;
              setState(allData);
            }}
            labelInValue={true}
            showSearch
            placeholder="Select Items"
            optionFilterProp="children"
          >
            {contactInvoices.length > 0 &&
              contactInvoices.map((item: IInvoiceResult, index: number) => {
                const usedIds = [];
                state.forEach((st) => {
                  if (st.id !== null) {
                    usedIds.push(st.id);
                  }
                });
                if (!usedIds.includes(item.id)) {
                  return (
                    <Option
                      key={index}
                      title={item.invoiceNumber}
                      value={item.id}
                    >
                      {item.invoiceNumber}
                    </Option>
                  );
                } else {
                  return null;
                }
              })}
          </Select>
        );
      },
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (data: any) => (
        <>{data ? dayjs(data).format(`	YYYY-MM-DD h:mm A`) : data}</>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'invoice_items',
      width: 70,
      key: 'invoice_items',
      render: (data: any) => <>{data && data.length}</>,
    },
    {
      title: 'Gross Total',
      dataIndex: 'grossTotal',
      key: 'grossTotal',
      render: (data: any) => <>{data ? moneyFormat(data) : '-'}</>,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      width: 100,
      key: 'discount',
      render: (data) => <>{data ? moneyFormat(data) : '-'}</>,
    },
    {
      title: 'Total',
      dataIndex: 'netTotal',
      key: 'netTotal',
      render: (data: any) => <>{data ? moneyFormat(data) : '-'}</>,
    },

    {
      title: 'Remaining',
      dataIndex: 'balance',
      key: 'balance',
      render: (data: any) => <>{data ? moneyFormat(Math.abs(data)) : '-'}</>,
    },

    {
      title: '',
      dataIndex: '',
      width: 50,
      key: '',
      render: (data: any, row: any, index: number) => {
        return (
          <i
            onClick={() => {
              const allItems = [...state];
              allItems.splice(index, 1);
              setState(allItems);
            }}
          >
            <Icon
              style={{
                fontSize: convertToRem(17),
                color: `${(props: IThemeProps) => props?.theme?.colors?.$GRAY}`,
                cursor: 'pointer',
              }}
              icon={deleteIcon}
            />
          </i>
        );
      },
    },
  ];

  return columns;
}
