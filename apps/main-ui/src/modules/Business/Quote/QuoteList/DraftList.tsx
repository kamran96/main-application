/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from '../../../../api';
import {
  ConfirmModal,
  PurchaseListTopbar,
  SmartFilter,
  CommonTable,
} from '@components';

import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { PERMISSIONS } from '../../../../components/Rbac/permissions';
import { useRbac } from '../../../../components/Rbac/useRbac';

import { PDFQuotesCols } from './commonCol';
import { QuoteImport } from '../QuoteImport';
import DraftQuoteFilters from './QuotesFilters';

interface IProps {
  columns?: any[];
}
export const DraftQuotesList: FC<IProps> = ({ columns }) => {
  const queryCache = useQueryClient();
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: '',
    page_size: 10,
  });
  const [filterBar, setFilterBar] = useState<boolean>(false);
  const [quotesFilterSchema, setQuotesFilterSchema] =
    useState(DraftQuoteFilters);

  const { rbac } = useRbac(null);

  const { notificationCallback } = useGlobalContext();
  const [confirmModal, setConfirmModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { page, query, sortid, page_size } = allInvoicesConfig;

  const { mutate: mutateDeleteOrders, isLoading: deletingQuotesDraft } =
    useMutation(deleteInvoiceDrafts);

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `invoices-quotes-all?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.QUOTE,
      INVOICETYPE.DRAFT,
      'ALL',
      page,
      page_size,
      query,
    ],
    getInvoiceListAPI,
    {
      keepPreviousData: true,
    }
  );

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const onDeleteConfirm = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    mutateDeleteOrders(payload, {
      onSuccess: () => {
        [
          'invoices-quotes',
          ReactQueryKeys?.TRANSACTION_KEYS,
          ReactQueryKeys?.ITEMS_KEYS,
          ReactQueryKeys.INVOICE_VIEW,
          ReactQueryKeys.CONTACT_VIEW,
          'all-items',
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(`${key}`));
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
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            IErrorMessages.NETWORK_ERROR
          );
        }
      },
    });
  };

  const topRightBarPanel = () => {
    return (
      <div className="flex itemCenter">
        {/* <QuoteImport/> */}
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            const route = `/app${ISupportedRoutes.QUOTE}?tabIndex=draft&sortid=${sortid}&page=1&page_size=${page_size}&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={quotesFilterSchema}
        />
      </div>
    );
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

  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  useEffect(() => {
    if (
      allContacts.data &&
      allContacts.data.data &&
      allContacts.data.data.result
    ) {
      const { result } = allContacts.data.data;
      const schema = quotesFilterSchema;
      schema.contactId.value = [...result];
      setQuotesFilterSchema(schema);
    }
  }, [allContacts.data, quotesFilterSchema]);

  const { routeHistory } = useGlobalContext();
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
  }, [routeHistory, history]);

  return (
    <>
      <CommonTable
        pdfExportable={{ columns: PDFQuotesCols }}
        className="border-top-none"
        data={result}
        customTopbar={
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            hideDeleteButton={!rbac.can(PERMISSIONS.QUOTATIONS_DELETE)}
            onDelete={() => setConfirmModal(true)}
            isEditable={rbac.can(PERMISSIONS.QUOTATIONS_CREATE)}
            onEdit={() =>
              history.push(
                `/app${ISupportedRoutes.CREATE_QUOTE}/${selectedRow}`
              )
            }
          />
        }
        hasPrint
        topbarRightPannel={topRightBarPanel()}
        columns={columns}
        loading={isFetching || isLoading}
        onChange={(pagination, filters, sorter: any, extra) => {
          if (sorter.order === undefined) {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              sortid: null,
              page: pagination.current,
              page_size: pagination.pageSize,
            });
            const route = `/app${ISupportedRoutes.QUOTE}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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
              ISupportedRoutes.QUOTE
            }?tabIndex=draft&sortid=${
              sorter && sorter.order === 'descend'
                ? `-${sorter.field}`
                : sorter.field
            }&page=${pagination.current}&page_size=${page_size}&query=${query}`;
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
        loading={deletingQuotesDraft}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={onDeleteConfirm}
        type="delete"
        text="Are you sure want to delete selected Quotations?"
      />
    </>
  );
};
