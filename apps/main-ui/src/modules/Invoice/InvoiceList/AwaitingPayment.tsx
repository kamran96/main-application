/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../api';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { PDFICON } from '../../../components/Icons';
import { PurchaseListTopbar } from '../../../components/PurchasesListTopbar';
import { SmartFilter } from '../../../components/SmartFilter';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IContactTypes, IServerError, NOTIFICATIONTYPE } from '../../../modal';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';
import { useCols} from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
export const AwaitingtInvoiceList: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    pageSize: 10,
  });

  const [confirmModal, setConfirmModal] = useState(false);

  const { mutate: mutateDeleteOrders, isLoading: deletingInvoice } =
    useMutation(deleteInvoiceDrafts);

  const [filterBar, setFilterBar] = useState<boolean>(false);

  const [invoiceFiltersSchema, setInvoiceFilterSchema] =
    useState(InvoicesFilterSchema);

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

    const {PdfCols, _exportableCols } = useCols();

  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;

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
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.Payment_Awaiting}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.Approved,
      'AWAITING_PAYMENT',
      page,
      pageSize,
      query,
      sortid
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

  //HandleSorting
  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        sortid: 'id',
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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
      const route = `/app${
        ISupportedRoutes.INVOICES
      }?tabIndex=awating_payment&sortid=${
        sorter && sorter.order === 'descend'
          ? `-${sorter.field}`
          : sorter.field
      }&page=${
        pagination.current
      }&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  }

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        ['invoices', 'transactions?page', 'items?page', 'invoice-view'].forEach(
          (key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
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
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={invoiceFiltersSchema}
        />
      </div>
    );
  };

  const cols = [...columns];
  // cols.splice(5, 1, {
  //   title: "Paid Amount",
  //   dataIndex: "netTotal",
  //   render: (data, row) => {
  //     return <>{moneyFormat(data - Math.abs(row.balance))}</>;
  //   },
  // });

  cols.splice(6, 1, {
    title: 'Due Amount',
    dataIndex: 'due_amount',
    render: (data, row) => {
      return <>{moneyFormat(Math.abs(data))}</>;
    },
  });

  return (
    <>
      <CommonTable
        pdfExportable={{ columns: PdfCols }}
        exportable
        exportableProps={{
          fields: _exportableCols,
          fileName: 'awaiting-payments',
        }}
        className="border-top-none"
        topbarRightPannel={renderTobarRight()}
        hasPrint
        printTitle={'Payment Awaiting Invoices'}
        customTopbar={
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            isEditable={false}
            hideDeleteButton
            // hasApproveButton={true}
            onEdit={() => {
              history.push(
                `/app${ISupportedRoutes.CREATE_INVOICE}/${selectedRow[0]}`
              );
            }}
            // onDelete={() => {
            //   setConfirmModal(true);
            // }}
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
        totalItems={pagination && pagination.total}
        pagination={{
          pageSize: pageSize,
          position: ['bottomRight'],
          current: pagination && pagination.page_no,
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

export default AwaitingtInvoiceList;
