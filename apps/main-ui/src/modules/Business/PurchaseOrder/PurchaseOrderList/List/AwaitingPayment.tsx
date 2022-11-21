import React, { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { findInvoiceByID, getInvoiceListAPI } from '../../../../../api';
import { Action } from '../../../../../components/Common';
import { CommonTable } from '../../../../../components/Table';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import convertToRem from '../../../../../utils/convertToRem';
import { Link } from 'react-router-dom';
import { useCols } from './CommonCol';
import { useHistory } from 'react-router-dom';
interface IProps {
  columns?: any[];
}
const defaultSortedId = 'id';
export const AwaitingPayment: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortedId,
    pageSize: 10,
  });
  const queryCache = useQueryClient();

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const { pdfColsPO, _csvColumns } = useCols();
  const history = useHistory();

  // `awaitingPayment_purchaseOrders?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys.PURCHASEORDERS_KEY,
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
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: defaultSortedId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
        history.push(route);
      } else {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });

        const route = `/app${
          ISupportedRoutes.PURCHASE_ORDER
        }?tabIndex=all&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${
          pagination.pageSize
        }&filterOrder=${sorter?.order}&query=${query}`;
        history.push(route);
      }
    } else {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid: defaultSortedId,
      });

      const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys?.PURCHASEORDERS_KEY,
            INVOICETYPE.ALL,
            INVOICETYPE.DRAFT,
            page + 1,
            pageSize,
            query,
            sortid,
          ],
          getInvoiceListAPI
        );
      }
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
        onRow={(record) => {
          return {
            onMouseEnter: () => {
              queryCache.prefetchQuery(
                [
                  ReactQueryKeys?.INVOICE_VIEW,
                  record?.id && record?.id?.toString(),
                  IInvoiceType.PURCHASE_ORDER,
                ],
                findInvoiceByID
              );
            },
          };
        }}
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
