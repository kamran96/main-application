import React, { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getInvoiceListAPI } from '../../../../../api';
import { Action } from '../../../../../components/Common';
import { CommonTable } from '../../../../../components/Table';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from '../../../../../modal/invoice';
import convertToRem from '../../../../../utils/convertToRem';
import { Link } from 'react-router-dom';
import { useCols} from './CommonCol';
import {useHistory} from "react-router-dom"
import {ISupportedRoutes } from '../../../../../modal';
interface IProps {
  columns?: any[];
}
export const AwaitingPayment: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: '',
    pageSize: 10,
  });

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const {pdfColsPO, _csvColumns } = useCols();
  const history = useHistory();

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `awaitingPayment_purchaseOrders?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      ORDER_TYPE.PURCAHSE_ORDER,
      INVOICETYPE.Payment_Awaiting,
      page,
      pageSize,
      sortid,
    ],
    getInvoiceListAPI,
    {
      keepPreviousData: true,
    }
  );

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        sortid: null,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
      history.push(route);
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setAllInvoicesRes(prev =>({...prev,  result: userData}))
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setAllInvoicesRes(prev =>({...prev,  result: userData}))
      }
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field,
      });

      const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${
        sorter && sorter.order === 'descend'
          ? `-${sorter.field}`
          : sorter.field
      }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  }


  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
    }
  }, [resolvedData]);

  const renderTopbar = () => {
    return (
      <div className="custom_topbar">
        <div className="edit flex alignCenter">
          {selectedRow && selectedRow.length > 0 && (
            <>
              <Action type="delete" componentType="text" />
              {selectedRow && selectedRow.length === 1 && (
                <Action className="ml-10" type="edit" componentType="text" />
              )}
            </>
          )}
        </div>
        <div className="search flex alignCenter">
          <div className="mr-10 w-100 textRight">
            {selectedRow && selectedRow.length > 0 && selectedRow.length < 2 && (
              <Link to={`create-bill?bill-type=purchase&po=${selectedRow[0]}`}>
                <Button type="primary" size="middle">
                  Create Purchase Bill{' '}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ALlWrapper>
      <CommonTable
        pdfExportable={{ columns: pdfColsPO }}
        exportable
        exportableProps={{
          fields: _csvColumns,
          fileName: 'payment-awaiting-POs',
        }}
        customTopbar={renderTopbar()}
        data={result}
        columns={columns}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
        totalItems={pagination && pagination.total}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '150'],
          pageSize: pageSize,
          position: ['bottomRight'],
          current: page,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
    </ALlWrapper>
  );
};

export const ALlWrapper = styled.div`
  .custom_topbar {
    padding: ${convertToRem(20)} 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .edit {
    flex: 8;
  }

  .search {
    flex: 4;
  }
`;
