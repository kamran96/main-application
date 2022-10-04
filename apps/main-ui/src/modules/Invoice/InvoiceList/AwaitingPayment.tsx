/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

import {
  deleteInvoiceDrafts,
  findInvoiceByID,
  getAllContacts,
  getContactLedger,
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
  IContactTypes,
  IServerError,
  NOTIFICATIONTYPE,
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';
import { useCols } from './commonCol';
import { InvoiceImports } from './invoiceImports';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
const defaultSortId = 'id';
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

  const { PdfCols, _exportableCols } = useCols();

  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;

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

  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  useEffect(() => {
    if (allContacts?.data?.data?.result) {
      const { result } = allContacts?.data?.data;
      const schema = invoiceFiltersSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setInvoiceFilterSchema(schema);
    }
  }, [allContacts.data, invoiceFiltersSchema]);

  // `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.Payment_Awaiting}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys?.INVOICES_KEYS,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.Approved,
      'AWAITING_PAYMENT',
      page,
      pageSize,
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
            'AWAITING_PAYMENT',
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

  //HandleSorting
  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: defaultSortId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
        history.push(route);
      } else {
        // if (sorter?.order === 'ascend') {
        //   const userData = [...result].sort((a, b) => {
        //     if (a[sorter?.field] > b[sorter?.field]) {
        //       return 1;
        //     } else {
        //       return -1;
        //     }
        //   });

        //   setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
        // } else {
        //   const userData = [...result].sort((a, b) => {
        //     if (a[sorter?.field] < b[sorter?.field]) {
        //       return 1;
        //     } else {
        //       return -1;
        //     }
        //   });

        //   setAllInvoicesRes((prev) => ({ ...prev, result: userData }));
        // }
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter?.order === 'ascend'
              ? sorter.field
              : 'id',
        });
        const route = `/app${
          ISupportedRoutes.INVOICES
        }?tabIndex=awating_payment&sortid=${
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
    } else {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid: defaultSortId,
      });
      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment&sortid=${defaultSortId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

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
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
        });

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

  const renderTobarRight = () => {
    return (
      <div className="flex alignCenter">
        {/* <InvoiceImports/> */}
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
        onRow={(record) => {
          return {
            onMouseEnter: () => {
              const prefetchQueries = [
                {
                  queryKey: [
                    ReactQueryKeys?.CONTACT_VIEW,
                    record?.contactId,
                    record?.contact?.contactType,
                    '',
                    20,
                    1,
                  ],
                  fn: getContactLedger,
                },
                {
                  queryKey: [
                    ReactQueryKeys?.INVOICE_VIEW,
                    record?.id && record?.id?.toString(),
                    IInvoiceType.INVOICE,
                  ],
                  fn: findInvoiceByID,
                },
              ];

              for (const CurrentQuery of prefetchQueries) {
                queryCache.prefetchQuery(
                  CurrentQuery?.queryKey,
                  CurrentQuery?.fn
                );
              }
            },
          };
        }}
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
