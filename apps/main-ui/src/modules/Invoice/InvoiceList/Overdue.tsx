/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import {
  queryCache,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from 'react-query';
import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../api';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { PDFICON } from '../../../components/Icons';
import { PurchaseListTopbar } from '../../../components/PurchasesListTopbar';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useRbac } from '../../../components/Rbac/useRbac';
import { SmartFilter } from '../../../components/SmartFilter';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IContactTypes, IServerError, NOTIFICATIONTYPE } from '../../../modal';
import {
  IInvoiceResponse,
  INVOICETYPE,
  INVOICE_TYPE_STRINGS,
  ORDER_TYPE,
} from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import { _exportableCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
export const OverDueInvoices: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: '',
    page_size: 10,
  });

  const { rbac } = useRbac(null);

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [confirmModal, setConfirmModal] = useState(false);
  const { notificationCallback } = useGlobalContext();

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

  const [invoiceFiltersSchema, setInvoiceFilterSchema] =
    useState(InvoicesFilterSchema);
  const [selectedRow, setSelectedRow] = useState([]);

  const [filterBar, setFilterBar] = useState<boolean>(false);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

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

  const { page, query, sortid, page_size } = allInvoicesConfig;

  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.Approved,
      INVOICE_TYPE_STRINGS.Date_Expired,
      page,
      page_size,
      query,
    ],
    getInvoiceListAPI
  );
  const [mutateDeleteOrders, resDeleteOrders] =
    useMutation(deleteInvoiceDrafts);

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

  /* Function select rows and to set selectedRow state */

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        [
          'invoices',
          'transactions',
          'items?page',
          'invoice-view',
          'ledger-contact',
          'all-items',
        ].forEach((key) => {
          queryCache.invalidateQueries((q) =>
            q.queryKey[0].toString().startsWith(`${key}`)
          );
        });
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Deleted Successfully');

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

  const cols = [...columns];

  cols.splice(2, 0, {
    title: 'Return',
    dataIndex: 'isReturn',
    render: (data) => <>{data && data === true ? 'Returned' : ''}</>,
  });

  /* Functions Here */

  const renderTobarRight = () => {
    return (
      <div className="flex alignCenter">
        <Button
          className="mr-10 flex alignCenter _print_button"
          disabled={true}
          type="ghost"
        >
          <PDFICON className="flex alignCenter mr-10" /> Download as PDF
        </Button>
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=due_expired&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
        // themeScroll
        className="border-top-none"
        topbarRightPannel={renderTobarRight()}
        hasPrint
        exportableProps={{
          fields: _exportableCols,
          fileName: 'approved-invoices',
        }}
        exportable
        printTitle={'Approved Invoices'}
        customTopbar={
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            onDelete={() => setConfirmModal(true)}
            hideDeleteButton={!rbac.can(PERMISSIONS.INVOICES_DELETE)}
            renderSmartFilter={
              <SmartFilter
                onFilter={(encode) => {
                  setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
                  const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=due_expired&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
                  history.push(route);
                }}
                onClose={() => setFilterBar(false)}
                visible={filterBar}
                formSchema={invoiceFiltersSchema}
              />
            }
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={(pagination, filters, sorter: any, extra) => {
          if (sorter.order === undefined) {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              sortid: null,
              page: pagination.current,
              page_size: pagination.pageSize,
            });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=due_expired&sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
            history.push(route);
          } else {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              page: pagination.current,
              page_size: pagination.pageSize,
              sortid:
                sorter && sorter.order === 'descend'
                  ? `-${sorter.field}`
                  : sorter.field,
            });
            const route = `/app${
              ISupportedRoutes.INVOICES
            }?tabIndex=due_expired&sortid=null&page=${
              pagination.current
            }&page_size=${pagination.pageSize}&query=${query}&sortid=${
              sorter && sorter.order === 'descend'
                ? `-${sorter.field}`
                : sorter.field
            }`;
            history.push(route);
          }
        }}
        totalItems={pagination && pagination.total}
        pagination={{
          pageSize: page_size,
          position: ['bottomRight'],
          current: pagination && pagination.page_no,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
      <ConfirmModal
        loading={resDeleteOrders.isLoading}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </>
  );
};

export default OverDueInvoices;
