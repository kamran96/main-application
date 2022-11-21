/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import {
  deletePurchaseDrafts,
  findInvoiceByID,
  getAllContacts,
  getContactLedger,
  getPoListAPI,
} from '../../../../../api';
import { ConfirmModal, SmartFilter, CommonTable } from '@components';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import {
  IContactType,
  IContactTypes,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
  IInvoiceResponse,
  INVOICETYPE,
  INVOICE_TYPE_STRINGS,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import { useRbac } from '../../../../../components/Rbac/useRbac';
import FilterSchema from './PoFilterSchema';
import { PurchaseTopbar } from './PurchaseTableTopbar';
import { useCols } from './CommonCol';
import { ImportBill } from '../importBill';

interface IProps {
  columns?: any[];
}
const defaultSortedId = 'id';
export const DraftBills: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  /* HOOKS HERE */
  /* Mutations */
  /* THIS MUTATION IS RESPONSIBLE FOR APPROVED DRAFT ORDERS */

  /* THIS MUTATION IS RESPONSIBLE FOR DELETE ORDERS */
  const { mutate: mutateDeleteOrders, isLoading: deletingPurchaseOrder } =
    useMutation(deletePurchaseDrafts);
  /* COMPONENT STATE MANAGEMENT HOOKS */
  const [selectedRow, setSelectedRow] = useState([]);
  const [filterBar, setFilterbar] = useState(false);
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortedId,
    page_size: 10,
  });
  const { page, query, sortid, page_size } = allInvoicesConfig;
  const { PDFColsBills, _csvExportable } = useCols();

  const [confirmModal, setConfirmModal] = useState(false);
  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { rbac } = useRbac(null);
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

  /* ********* PAGINATED QUERY FOR FETCHING DRAFT ORDERS *************** */
  // `invoices-purchases-${INVOICETYPE.DRAFT}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys.BILL_KEYS,
      ORDER_TYPE.PURCAHSE_ORDER,
      INVOICETYPE.DRAFT,
      'ALL',
      page,
      page_size,
      query,
      sortid,
    ],
    getPoListAPI,
    {
      keepPreviousData: true,
    }
  );

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: null,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=draft&sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}`;
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
          ISupportedRoutes.PURCHASES
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
        page_size: pagination.pageSize,
        sortid: defaultSortedId,
      });
      const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=draft&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
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
      const { result, pagination } = resolvedData?.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.BILL_KEYS,
            ORDER_TYPE.PURCAHSE_ORDER,
            INVOICETYPE.DRAFT,
            'ALL',
            page + 1,
            page_size,
            query,
            sortid,
          ],
          getPoListAPI
        );
      }
    }
  }, [resolvedData]);

  /* Columns are overided to add  actions column in table */
  const cols = [...columns];

  const renerTopRightbar = () => {
    return (
      <div className="flex alignCenter">
        {/* <ImportBill/> */}
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              query: encode,
            });
            const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=draft&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
                    IInvoiceType.BILL,
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
        pdfExportable={{ columns: PDFColsBills }}
        exportable
        exportableProps={{
          fields: _csvExportable,
        }}
        className={'border-top-none'}
        topbarRightPannel={renerTopRightbar()}
        hasPrint
        printTitle={'Draft Bills'}
        customTopbar={
          <PurchaseTopbar
            disabled={!selectedRow.length}
            isEditable={selectedRow.length === 1}
            isAbleToDelete={false}
            // onDelete={() => {
            //   setConfirmModal(true);
            // }}
            onEdit={() => {
              const id = selectedRow[0];
              history.push(
                `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/${id}`
              );
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
        loading={deletingPurchaseOrder}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </ALlWrapper>
  );
};

export default DraftBills;

export const ALlWrapper = styled.div``;
