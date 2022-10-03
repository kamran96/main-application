/* eslint-disable react-hooks/exhaustive-deps */

import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery, QueryCache } from 'react-query';
import { InvoiceImports } from './invoiceImports';
import {
  deleteInvoiceDrafts,
  findInvoiceByID,
  getAllContacts,
  getContactLedger,
  getInvoiceListAPI,
} from '../../../api';
import {
  ConfirmModal,
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
  ORDER_TYPE,
  IContactTypes,
  IServerError,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import { useCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
const defaultSortId = 'id';
export const DraftInvoiceList: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  /* Global context */
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;
  const [confirmModal, setConfirmModal] = useState(false);
  const { rbac } = useRbac(null);

  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 10,
  });
  const { page, query, sortid, page_size } = allInvoicesConfig;
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

  const { mutate: mutateDeleteOrders, isLoading: isDeletingInvoice } =
    useMutation(deleteInvoiceDrafts);
  /* Query to fetch all contacts without pagination */
  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  /* PaginatedQuery to fetch draft invoices with pagination */
  // `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.DRAFT}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys?.INVOICES_KEYS,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.DRAFT,
      'ALL',
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

  /* Components Life Cycle methods */

  /* This lifecycle is resposible to update invoiceresponse state when paginated query fetches draft invoices successfully */
  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });

      if (pagination.next === page + 1) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys?.INVOICES_KEYS,
            ORDER_TYPE.SALE_INVOICE,
            INVOICETYPE.DRAFT,
            'ALL',
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

  /* Component did update if route history changed */
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
  }, [routeHistory]);

  /* Component did update (effects when data in allContacts values changed) */
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

  /////* Life cycles ends here *////

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: defaultSortId,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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
          page_size: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.order === 'asceend'
              ? sorter.field
              : 'id',
        });

        const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=draft&sortid=${
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
        page_size: pagination.pageSize,
        sortid: defaultSortId,
      });

      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=draft&sortid=${defaultSortId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  /* Columns are overided to add  actions column in table */

  /* Function select rows and to set selectedRow state */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    // console.log(payload, "payload");
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        [
          ReactQueryKeys?.INVOICES_KEYS,
          ReactQueryKeys?.TRANSACTION_KEYS,
          ReactQueryKeys?.ITEMS_KEYS,
          ReactQueryKeys?.INVOICE_VIEW,
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) =>
            q.queryKey[0].toString().startsWith(key)
          );
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
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=draft&sortid=${sortid}&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={invoiceFiltersSchema}
        />
      </div>
    );
  };

  /* Functions Here */

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
        className="border-top-none"
        exportable
        exportableProps={{
          fields: _exportableCols,
          fileName: 'draft-invoices',
        }}
        hasPrint
        topbarRightPannel={renderTobarRight()}
        printTitle={'Draft Invoices'}
        customTopbar={
          <PurchaseListTopbar
            hideDeleteButton={!rbac.can(PERMISSIONS.INVOICES_DELETE)}
            disabled={!selectedRow.length}
            isEditable={true}
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
        columns={columns.filter(
          (item) =>
            item.dataIndex !== 'dueDate' &&
            item.dataIndex !== 'paid_amount' &&
            item.dataIndex !== 'due'
        )}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
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
        loading={isDeletingInvoice}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </>
  );
};

export default DraftInvoiceList;
