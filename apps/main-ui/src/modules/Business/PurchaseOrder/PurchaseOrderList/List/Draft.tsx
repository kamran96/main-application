/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import {
  purchaseOrderDeleteAPI,
  getAllContacts,
  purchaseOrderList,
  findInvoiceByID,
} from '../../../../../api';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { ConfirmModal, SmartFilter, CommonTable } from '@components';

import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import { useRbac } from '../../../../../components/Rbac/useRbac';

import {
  IContactType,
  IContactTypes,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import { useCols } from './CommonCol';
import FilterSchema from './PoFilterSchema';
import { PurchaseOrderImport } from '../PurchaseOrderImport';
import { PurchaseTopbar } from './PurchaseTableTopbar';

interface IProps {
  columns?: any[];
}

const defaultSortedId = 'id';

export const DraftPurchaseOrdersList: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  /* HOOKS HERE */
  /* Mutations */
  /* THIS MUTATION IS RESPONSIBLE FOR APPROVED DRAFT ORDERS */

  /* THIS MUTATION IS RESPONSIBLE FOR DELETE ORDERS */
  const { mutate: mutateDeleteOrders, isLoading: deletingPurchaseOrders } =
    useMutation(purchaseOrderDeleteAPI);
  /* COMPONENT STATE MANAGEMENT HOOKS */
  const [selectedRow, setSelectedRow] = useState([]);
  const [filterBar, setFilterbar] = useState(false);
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortedId,
    pageSize: 10,
  });

  const { page, query, sortid, pageSize } = allInvoicesConfig;

  const { pdfColsPO, _csvColumns } = useCols();
  const { rbac } = useRbac(null);

  const [confirmModal, setConfirmModal] = useState(false);
  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const [filteringSchema, setFilteringSchema] = useState(FilterSchema);

  /*Query hook for  Fetching all accounts against ID */
  const { data: allContactsData } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts
  );
  const allcontactsRes: IContactType[] =
    allContactsData && allContactsData.data && allContactsData.data.result;

  useEffect(() => {
    if (allcontactsRes && allcontactsRes.length) {
      const filteredSchema = {
        ...FilterSchema,
        contactId: {
          ...FilterSchema.contactId,
          value: allcontactsRes.filter(
            (item) => item.contactType === IContactTypes.SUPPLIER
          ),
        },
      };
      setFilteringSchema(filteredSchema);
    }
  }, [allcontactsRes]);

  /* *************** STATES ENDS HERE ************** */

  /* GLOBAL MANAGER CONTEXT API */
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;
  const { search } = history.location;

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
  }, [search]);
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ********* PAGINATED QUERY FOR FETCHING DRAFT ORDERS *************** */
  // `invoices-${ORDER_TYPE.PURCAHSE_ORDER}-${INVOICETYPE.DRAFT}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys?.PURCHASEORDERS_KEY,
      INVOICETYPE.ALL,
      INVOICETYPE.DRAFT,
      page,
      pageSize,
      query,
      sortid,
    ],
    purchaseOrderList,
    {
      keepPreviousData: true,
    }
  );

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: defaultSortedId,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
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
        }?tabIndex=draft&sortid=${
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
      const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  /* ********** METHODS HERE *************** */
  /* ************** ASYNC FUNCTION IS TO  DELETE ORDER ******** */
  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        [ReactQueryKeys?.INVOICES_KEYS, ReactQueryKeys.INVOICE_VIEW].forEach(
          (key) => {
            (queryCache.invalidateQueries as any)((q) =>
              q?.startsWith(`${key}`)
            );
          }
        );
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Deleted Successfully');

        setSelectedRow([]);
        setConfirmModal(false);
      },
      onError: (error: IServerError) => {
        if (error?.response?.data?.message) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            IErrorMessages.NETWORK_ERROR
          );
        }
      },
    });
  };

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const newResult = [];
      result?.forEach((item, index) => {
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
          purchaseOrderList
        );
      }
    }
  }, [resolvedData]);

  /* Columns are overided to add  actions column in table */
  const cols = [...columns];
  cols?.splice(8, 0, {
    title: 'Created By',
    dataIndex: 'owner',
    key: 'owner',
    sorter: false,
    render: (data) => (
      <span className="capitalize">{data?.profile?.fullName}</span>
    ),
  });

  const renerTopRightbar = () => {
    return (
      <div className="flex alignCenter">
        {/* <PurchaseOrderImport/> */}
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              query: encode,
            });
            const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterbar(false)}
          visible={filterBar}
          formSchema={filteringSchema}
        />
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
          fileName: 'draft-POs',
        }}
        className={'border-top-none'}
        topbarRightPannel={renerTopRightbar()}
        hasPrint
        printTitle={'Draft Purchase Orders '}
        customTopbar={
          <PurchaseTopbar
            disabled={!selectedRow.length}
            isEditable={selectedRow.length === 1}
            isAbleToDelete={rbac.can(PERMISSIONS.PURCHASE_ORDERS_DELETE)}
            onDelete={() => {
              setConfirmModal(true);
            }}
            onEdit={() => {
              const id = selectedRow[0];
              const [filteredOrder] = result.filter((item) => item.id === id);

              if (filteredOrder && filteredOrder.invoiceType === 'POE') {
                history.push(
                  `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/${id}`
                );
              } else if (filteredOrder && filteredOrder.invoiceType === 'PO') {
                history.push(
                  `/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}/${id}`
                );
              }
            }}
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
        totalItems={pagination && pagination.total}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          pageSize: pageSize,
          position: ['bottomRight'],
          current: typeof page === 'string' ? parseInt(page) : page,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
      <ConfirmModal
        loading={deletingPurchaseOrders}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </ALlWrapper>
  );
};

export default DraftPurchaseOrdersList;

export const ALlWrapper = styled.div``;
