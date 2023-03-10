/* eslint-disable react-hooks/exhaustive-deps */
/* THIS PAGE BELONGS TO ALL PURCHASES ORDERS TAB */
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import {
  purchaseOrderDeleteAPI,
  getAllContacts,
  findInvoiceByID,
} from '../../../../../api';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from '../../../../../modal/invoice';
import {
  IBaseAPIError,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';

import { CommonTable, ConfirmModal, SmartFilter } from '@components';

import convertToRem from '../../../../../utils/convertToRem';
import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import { useRbac } from '../../../../../components/Rbac/useRbac';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import FilterSchema from './PoFilterSchema';
import { PurchaseTopbar } from './PurchaseTableTopbar';
import { purchaseOrderList } from '../../../../../api/purchaseOrder';
import { useCols } from './CommonCol';
import { PurchaseOrderImport } from '../PurchaseOrderImport';

interface IProps {
  columns?: any[];
  activeTab?: string;
}

const defaultSortedId = 'id';
export const ALLPurchaseOrdersList: FC<IProps> = ({ columns, activeTab }) => {
  /* HOOKS HERE */
  const queryCache = useQueryClient();
  /* Mutations */
  const { mutate: mutateDeleteOrders, isLoading: deletingPurchaseOrder } =
    useMutation(purchaseOrderDeleteAPI);

  /* RBAC */
  const { rbac } = useRbac(null);

  /* ****** Global Context ******* */
  const { notificationCallback } = useGlobalContext();

  /*  ********** COMPONENT STATE HOOKS  *********** */
  const [filterBar, setFilterbar] = useState(false);
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortedId,
    pageSize: 10,
  });
  /* ********* DESTRUCTURING ALL INVOICESCONFIG *************** */
  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const { pdfColsPO, _csvColumns } = useCols();

  const [confirmModal, setConfirmModal] = useState(false);
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [selectedRow, setSelectedRow] = useState([]);
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
  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

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
  }, [routeHistory, history]);
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ******* PAGINATED QUERY TO FETCH LIST OF PURCHASES ********** */
  /* ******* ORDERS ONLY TYPE (PROCESSED PURCHASE ORDERS) ********** */

  // `invoices-${ORDER_TYPE.PURCAHSE_ORDER}-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys?.PURCHASEORDERS_KEY,
      INVOICETYPE.ALL,
      INVOICETYPE.Approved,
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
        const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
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
        }?tabIndex=all&sortid=${
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

      const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  /* CONDITIONAL RENDERING LIFE CYCLE HOOK TO UPDATE ALL INVOICES STATE WHEN API CALL IS DONE */
  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache.prefetchQuery(
          [
            ReactQueryKeys?.PURCHASEORDERS_KEY,
            INVOICETYPE.ALL,
            INVOICETYPE.Approved,
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

  /* DELETE PURCHASE ORDER METHOD */
  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Deleted Successfully');
        [
          ReactQueryKeys?.INVOICES_KEYS,
          ReactQueryKeys?.TRANSACTION_KEYS,
          ReactQueryKeys?.ITEMS_KEYS,
          ReactQueryKeys.INVOICE_VIEW,
          ReactQueryKeys.CONTACT_VIEW,
          'all-items',
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(`${key}`));
        });

        setSelectedRow([]);
        setConfirmModal(false);
      },
      onError: (error: IBaseAPIError) => {
        if (error?.response?.data?.message) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        }
      },
    });
  };

  /* METHOD TO UPDATE SELECTED ROW OF TABLE */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const cols = [...columns];

  cols?.splice(8, 0, {
    title: 'Approved By',
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
            const route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterbar(false)}
          visible={filterBar}
          formSchema={filteringSchema}
        />
      </div>
    );
  };

  /* JSX HERE */
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
          fileName: 'approved-purchase-orders',
        }}
        printTitle={'Approved Purchase Orders'}
        className={'border-top-none'}
        hasPrint
        topbarRightPannel={renerTopRightbar()}
        customTopbar={
          <PurchaseTopbar
            onDelete={() => setConfirmModal(true)}
            isAbleToDelete={rbac.can(PERMISSIONS.PURCHASE_ORDERS_DELETE)}
            disabled={!selectedRow.length}
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={onChangePagination}
        totalItems={pagination && pagination.total}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '150'],
          pageSize: pageSize,
          position: ['bottomRight'],
          current: page,
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

export default ALLPurchaseOrdersList;

/* COMPONENT STYLES HERE */
export const ALlWrapper = styled.div`
  .custom_topbar {
    padding: ${convertToRem(20)} 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .edit {
    flex: 8;
  }

  .search {
    flex: 4;
  }

  .custom_button {
  }
`;
