/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { InvoiceImports } from './invoiceImports';
import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../api';
import {
  ConfirmModal,
  PDFICON,
  PurchaseListTopbar,
  SmartFilter,
  CommonTable,
} from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
  IContactTypes,
  IServerError,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
} from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';
import { useCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
export const PaidtInvoiceList: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  const { mutate: mutateDeleteOrders, isLoading: deletingInvoice } =
    useMutation(deleteInvoiceDrafts);

  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 10,
  });
  const { page, query, sortid, page_size } = allInvoicesConfig;

  const [confirmModal, setConfirmModal] = useState(false);

  const [filterBar, setFilterBar] = useState<boolean>(false);

  const [invoiceFiltersSchema, setInvoiceFilterSchema] =
    useState(InvoicesFilterSchema);

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;
  const { PdfCols, _exportableCols } = useCols();

  useEffect(() => {
    if (
      routeHistory &&
      routeHistory.history &&
      routeHistory.history.location &&
      routeHistory.history.location.search
    ) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAllInvoicesConfig({ ...allInvoicesConfig, ...obj });
    }
  }, [routeHistory]);

  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  const cols = columns?.filter(
    (col) => col?.dataIndex !== 'due' && col?.dataIndex !== 'dueDate'
  );

  useEffect(() => {
    if (
      allContacts.data &&
      allContacts.data.data &&
      allContacts.data.data.result
    ) {
      const { result } = allContacts.data.data;
      const schema = invoiceFiltersSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setInvoiceFilterSchema(schema);
    }
  }, [allContacts.data, invoiceFiltersSchema]);

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.PAID}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.Approved,
      'PAID ',
      page,
      page_size,
      query,
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

  //handleSorting

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        sortid: 'id',
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=paid&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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

        setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });

        setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
      }
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.order === 'asceend'
            ? sorter.field
            : 'id',
      });

      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=paid&sortid=${
        sorter && sorter?.order === 'descend'
          ? `-${sorter?.field}`
          : sorter?.order === 'ascend'
          ? sorter.field
          : 'id'
      }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
        sorter?.order
      }&query=${query}`;
      history.push(route);
    }
  };

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        ['invoices', 'transactions?page', 'items-list', 'invoice-view'].forEach(
          (key) => {
            (queryCache.invalidateQueries as any)((q) =>
              q.queryKey[0].toString().startsWith(key)
            );
          }
        );

        setSelectedRow([]);
        setConfirmModal(false);
      },
      onError: (error: IServerError) => {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        }
      },
    });
  };

  const renderTobarRight = () => {
    return (
      <div className="flex alignCenter">
        {/* <InvoiceImports/> */}
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=paid&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={invoiceFiltersSchema}
        />
      </div>
    );
  };

  return (
    <>
      <CommonTable
        pdfExportable={{ columns: PdfCols }}
        exportable
        exportableProps={{ fields: _exportableCols, fileName: 'paid-invoices' }}
        className="border-top-none"
        topbarRightPannel={renderTobarRight()}
        hasPrint
        printTitle={'Paid Invoices'}
        customTopbar={
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            isEditable={true}
            hideDeleteButton
            // hasApproveButton={true}
            onEdit={() => {
              history.push(
                `/app${ISupportedRoutes.CREATE_INVOICE}/${selectedRow[0]}`
              );
            }}
            onDelete={() => {
              setConfirmModal(true);
            }}
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
        totalItems={pagination && pagination.total}
        pagination={{
          pageSize: page_size,
          position: ['bottomRight'],
          current: pagination?.page_no,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
      <ConfirmModal
        loading={deletingInvoice}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </>
  );
};

export default PaidtInvoiceList;
