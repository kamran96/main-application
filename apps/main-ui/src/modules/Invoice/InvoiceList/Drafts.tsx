/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

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
  ORDER_TYPE,
} from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import { _exportableCols } from './commonCol';
import InvoicesFilterSchema from './InvoicesFilterSchema';

interface IProps {
  columns?: any[];
}
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

  const { mutate: mutateDeleteOrders, isLoading: isDeletingInvoice } =
    useMutation(deleteInvoiceDrafts);
  /* Query to fetch all contacts without pagination */
  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  /* PaginatedQuery to fetch draft invoices with pagination */
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.DRAFT}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.SALE_INVOICE,
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

  /* Components Life Cycle methods */

  /* This lifecycle is resposible to update invoiceresponse state when paginated query fetches draft invoices successfully */
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

  /* Component did update if route history changed */
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

  /* Component did update (effects when data in allContacts values changed) */
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

  /////* Life cycles ends here *////

  /* Columns are overided to add  actions column in table */

  /* Function select rows and to set selectedRow state */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        ['invoices', 'transactions?page', 'items?page', 'invoice-view'].forEach(
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
        <Button
          className="mr-10 flex alignCenter _print_button"
          disabled={true}
          type="ghost"
        >
          <PDFICON className="flex alignCenter mr-10" /> Download as PDF
        </Button>
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
        onChange={(pagination, filters, sorter: any, extra) => {
          if (sorter.order === undefined) {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              sortid: null,
              page: pagination.current,
              page_size: pagination.pageSize,
            });
            const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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
            }?tabIndex=draft&sortid=${sortid}&page=${
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
