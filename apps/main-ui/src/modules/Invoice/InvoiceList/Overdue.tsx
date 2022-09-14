/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../api';
import { InvoiceImports } from './invoiceImports';
import {
  ConfirmModal,
  PDFICON,
  PurchaseListTopbar,
  SmartFilter,
  CommonTable,
} from '@components';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useRbac } from '../../../components/Rbac/useRbac';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IInvoiceResponse,
  INVOICETYPE,
  INVOICE_TYPE_STRINGS,
  ORDER_TYPE,
  ISupportedRoutes,
  IContactTypes,
  IServerError,
  NOTIFICATIONTYPE,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { useCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}

const defaultSortId = 'id';
export const OverDueInvoices: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 10,
  });

  const { rbac } = useRbac(null);

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [confirmModal, setConfirmModal] = useState(false);
  const { notificationCallback } = useGlobalContext();

  const { PdfCols, _exportableCols } = useCols();

  useEffect(() => {
    if (routeHistory?.history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAllInvoicesConfig({ ...allInvoicesConfig, ...obj });
    }
  }, []);

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
    if (allContacts?.data?.data?.result) {
      const { result } = allContacts.data.data;
      const schema = invoiceFiltersSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setInvoiceFilterSchema(schema);
    }
  }, [allContacts.data, invoiceFiltersSchema]);

  const { page, query, sortid, page_size } = allInvoicesConfig;

  // `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys?.INVOICES_KEYS,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.Approved,
      INVOICE_TYPE_STRINGS.Date_Expired,
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
  const { mutate: mutateDeleteOrders, isLoading: isDeletingDraftInvoice } =
    useMutation(deleteInvoiceDrafts);

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
      if (pagination?.next === page + 1) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys?.INVOICES_KEYS,
            ORDER_TYPE.SALE_INVOICE,
            INVOICETYPE.Approved,
            INVOICE_TYPE_STRINGS.Date_Expired,
            page + 1,
            page_size,
            query,
            sortid,
          ],
          getInvoiceListAPI
        );
      }
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
          ReactQueryKeys?.INVOICES_KEYS,
          ReactQueryKeys?.TRANSACTION_KEYS,
          ReactQueryKeys?.ITEMS_KEYS,
          ReactQueryKeys?.INVOICE_VIEW,
          ReactQueryKeys.CONTACT_VIEW,
          'all-items',
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q.startsWith(`${key}`));
        });
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Deleted Successfully');

        setSelectedRow([]);
        setConfirmModal(false);
      },
      onError: (error: IServerError) => {
        if (error?.response?.data?.message) {
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
        {/* <InvoiceImports/> */}
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
        pdfExportable={{
          columns: PdfCols,
        }}
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
          if (sorter?.column) {
            if (sorter.order === 'false') {
              setAllInvoicesConfig({
                ...allInvoicesConfig,
                sortid: defaultSortId,
                page: pagination.current,
                page_size: pagination.pageSize,
              });
              const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=due_expired&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
              history.push(route);
            } else {
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
              const route = `/app${
                ISupportedRoutes.INVOICES
              }?tabIndex=due_expired&sortid=${
                sorter && sorter?.order === 'descend'
                  ? `-${sorter?.field}`
                  : sorter?.order === 'ascend'
                  ? sorter.field
                  : 'id'
              }&page=${pagination.current}&page_size=${
                pagination.pageSize
              }&filter=${sorter?.order}&query=${query}`;
              history.push(route);
            }
          } else {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              page: pagination.current,
              page_size: pagination.pageSize,
              sortid: defaultSortId,
            });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=due_expired&sortid=${defaultSortId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter?.order}&query=${query}`;
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
        loading={isDeletingDraftInvoice}
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
