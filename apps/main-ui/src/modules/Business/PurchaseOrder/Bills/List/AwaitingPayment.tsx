/* eslint-disable react-hooks/exhaustive-deps */
/* THIS PAGE BELONGS TO ALL PURCHASES ORDERS TAB */
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
import { CommonTable, SmartFilter, ConfirmModal } from '@components';
import {
  IInvoiceResponse,
  INVOICETYPE,
  INVOICE_TYPE_STRINGS,
  ORDER_TYPE,
  ISupportedRoutes,
  ReactQueryKeys,
  IInvoiceType,
} from '@invyce/shared/types';
import convertToRem from '../../../../../utils/convertToRem';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import FilterSchema from './PoFilterSchema';

import {
  IBaseAPIError,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
} from '../../../../../modal';
import { PurchaseTopbar } from './PurchaseTableTopbar';
import { useCols } from './CommonCol';
import { useRbac } from '../../../../../components/Rbac/useRbac';
import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import moneyFormat from '../../../../../utils/moneyFormat';
import { ImportBill } from '../importBill';

interface IProps {
  columns?: any[];
  activeTab?: string;
}

const defaultSortedId = 'id';
export const AwaitingBillsList: FC<IProps> = ({ columns, activeTab }) => {
  const queryCache = useQueryClient();
  /* HOOKS HERE */
  /* Mutations */
  const { mutate: mutateDeleteOrders, isLoading: deletingPurchaseOrder } =
    useMutation(deletePurchaseDrafts);

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
    page_size: 10,
  });
  /* ********* DESTRUCTURING ALL INVOICESCONFIG *************** */
  const { page, query, sortid, page_size } = allInvoicesConfig;
  const { PDFColsBills, _csvExportable } = useCols();

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
  // `invoices-purchases-${INVOICETYPE.Payment_Awaiting}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys.BILL_KEYS,
      [ORDER_TYPE.PURCAHSE_ORDER],
      INVOICETYPE.Approved,
      INVOICE_TYPE_STRINGS.Payment_Awaiting,
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

  /* CONDITIONAL RENDERING LIFE CYCLE HOOK TO UPDATE ALL INVOICES STATE WHEN API CALL IS DONE */
  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData?.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
      if (pagination?.next === page + 1) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.BILL_KEYS,
            [ORDER_TYPE.PURCAHSE_ORDER],
            INVOICETYPE.Approved,
            INVOICE_TYPE_STRINGS.Payment_Awaiting,
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

  //handleSorting

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter?.column) {
        if (sorter.order === 'false') {
          setAllInvoicesConfig({
            ...allInvoicesConfig,
            sortid: defaultSortedId,
            page: pagination.current,
            page_size: pagination.pageSize,
          });
          const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=awating_payment&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
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
          }?tabIndex=awating_payment&sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&page=${pagination.current}&page_size=${
            pagination.pageSize
          }&filter=${sorter.order}&query=${query}`;
          history.push(route);
        }
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
        }?tabIndex=awating_payment&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
          sorter.order
        }&query=${query}`;
        history.push(route);
      }
    } else {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid: defaultSortedId,
      });
      const route = `/app${ISupportedRoutes.INVOICES}?tabIndex=awating_payment&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  };

  /* DELETE PURCHASE ORDER METHOD */
  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    try {
      await mutateDeleteOrders(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            'Deleted Successfully'
          );
          [
            ReactQueryKeys?.INVOICES_KEYS,
            ReactQueryKeys?.TRANSACTION_KEYS,
            ReactQueryKeys?.ITEMS_KEYS,
            ReactQueryKeys.INVOICE_VIEW,
            ReactQueryKeys.CONTACT_VIEW,
            'all-items',
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) =>
              q?.startsWith(`${key}`)
            );
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
    } catch (error) {
      console.log(error);
    }
  };

  /* METHOD TO UPDATE SELECTED ROW OF TABLE */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const cols = [...columns];

  // cols.splice(6, 1, {
  //   title: 'Due Amount',
  //   dataIndex: 'due_amount',
  //   render: (data, row) => {
  //     return <>{moneyFormat(Math.abs(data))}</>;
  //   },
  // });

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
            const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=awating_payment&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
          fileName: 'approved-purchases',
        }}
        printTitle={'Payment Awaiting Bills'}
        className={'border-top-none'}
        hasPrint
        topbarRightPannel={renerTopRightbar()}
        customTopbar={
          <PurchaseTopbar
            onDelete={() => setConfirmModal(true)}
            isAbleToDelete={false}
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

export default AwaitingBillsList;

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
