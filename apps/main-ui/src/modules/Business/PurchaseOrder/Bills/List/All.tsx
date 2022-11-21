/* eslint-disable react-hooks/exhaustive-deps */
/* THIS PAGE BELONGS TO ALL PURCHASES ORDERS TAB */
import { ButtonTag, ConfirmModal, SmartFilter, CommonTable } from '@components';
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import { useRbac } from '../../../../../components/Rbac/useRbac';
import {
  findInvoiceByID,
  getAllContacts,
  getContactLedger,
  getPoListAPI,
} from '../../../../../api';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import {
  IBaseAPIError,
  IContactType,
  IContactTypes,
  IInvoiceResponse,
  IInvoiceType,
  INVOICETYPE,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  ORDER_TYPE,
  ReactQueryKeys,
} from '@invyce/shared/types';
import convertToRem from '../../../../../utils/convertToRem';
import { useCols } from './CommonCol';
import FilterSchema from './PoFilterSchema';
import { PurchaseTopbar } from './PurchaseTableTopbar';

interface IProps {
  columns?: any[];
  activeTab?: string;
}
const defaultSortedId = 'id';
export const ALLBillsList: FC<IProps> = ({ columns, activeTab }) => {
  const queryCache = useQueryClient();

  /* ****** Global Context ******* */
  const { notificationCallback, setPaymentsModalConfig } = useGlobalContext();

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

  const [confirmModal, setConfirmModal] = useState(false);
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filteringSchema, setFilteringSchema] = useState(FilterSchema);

  /*Query hook for  Fetching all accounts against ID */
  const { data: allContactsData } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts
  );
  const allcontactsRes: IContactType[] =
    allContactsData && allContactsData.data && allContactsData?.data?.result;

  const { PDFColsBills, _csvExportable } = useCols();

  useEffect(() => {
    if (allcontactsRes && allcontactsRes?.length) {
      const filteredSchema = {
        ...FilterSchema,
        contactId: {
          ...FilterSchema?.contactId,
          value: allcontactsRes?.filter(
            (item) => item?.contactType === IContactTypes.SUPPLIER
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
  }, []);
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ******* PAGINATED QUERY TO FETCH LIST OF PURCHASES ********** */
  /* ******* ORDERS ONLY TYPE (PROCESSED PURCHASE ORDERS) ********** */
  // `invoices-purchases-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys.BILL_KEYS,
      [ORDER_TYPE.PURCAHSE_ORDER],
      INVOICETYPE.Approved,
      INVOICETYPE.ALL,
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
    if (resolvedData && resolvedData?.data && resolvedData?.data?.result) {
      const { result, pagination } = resolvedData?.data;
      const newResult = [];
      result?.forEach((item, index) => {
        newResult?.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.BILL_KEYS,
            [ORDER_TYPE.PURCAHSE_ORDER],
            INVOICETYPE.Approved,
            INVOICETYPE.ALL,
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

  //handle Sorting

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setAllInvoicesConfig({
          ...allInvoicesConfig,
          sortid: defaultSortedId,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
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
        const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=all&sortid=${
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
      const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=all&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  /* DELETE PURCHASE ORDER METHOD */

  /* METHOD TO UPDATE SELECTED ROW OF TABLE */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
    setSelectedContact(item?.selectedRows?.[0]?.contactId);
  };

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
            const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=all&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
        printTitle={'Approved Bills '}
        className={'border-top-none'}
        hasPrint
        topbarRightPannel={renerTopRightbar()}
        customTopbar={
          <div className="flex alignCenter">
            <PurchaseTopbar
              isAbleToDelete={false}
              disabled={!selectedRow.length}
            />
            <ButtonTag
              disabled={selectedRow.length > 1}
              onClick={() => {
                setPaymentsModalConfig(true, null, {
                  contactId: selectedContact,
                  type: 'payable',
                  orders: selectedRow,
                });
              }}
              className="ml-5s"
              title="Create Payment"
              size="middle"
            />
          </div>
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
    </ALlWrapper>
  );
};

export default ALLBillsList;

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
