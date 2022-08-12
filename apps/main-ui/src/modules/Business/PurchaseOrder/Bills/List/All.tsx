/* eslint-disable react-hooks/exhaustive-deps */
/* THIS PAGE BELONGS TO ALL PURCHASES ORDERS TAB */
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

import {
  deletePurchaseDrafts,
  getAllContacts,
  getPoListAPI,
} from '../../../../../api';
import { ConfirmModal } from '../../../../../components/ConfirmModal';
import { PERMISSIONS } from '../../../../../components/Rbac/permissions';
import { useRbac } from '../../../../../components/Rbac/useRbac';
import { SmartFilter } from '../../../../../components/SmartFilter';
import { CommonTable } from '../../../../../components/Table';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import {
  IBaseAPIError,
  IContactType,
  IContactTypes,
  IInvoiceResponse,
  INVOICETYPE,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  ORDER_TYPE,
} from '../../../../../modal';
import convertToRem from '../../../../../utils/convertToRem';
import { ImportBill } from '../importBill';
import {useCols} from './CommonCol';
import FilterSchema from './PoFilterSchema';
import { PurchaseTopbar } from './PurchaseTableTopbar';

interface IProps {
  columns?: any[];
  activeTab?: string;
}
export const ALLBillsList: FC<IProps> = ({ columns, activeTab }) => {
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
    sortid: '',
    page_size: 10,
  });
  /* ********* DESTRUCTURING ALL INVOICESCONFIG *************** */
  const { page, query, sortid, page_size } = allInvoicesConfig;

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

    const { PDFColsBills, _csvExportable } = useCols();

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
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ******* PAGINATED QUERY TO FETCH LIST OF PURCHASES ********** */
  /* ******* ORDERS ONLY TYPE (PROCESSED PURCHASE ORDERS) ********** */
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `invoices-purchases-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      [ORDER_TYPE.PURCAHSE_ORDER],
      INVOICETYPE.Approved,
      INVOICETYPE.ALL,
      page,
      page_size,
      query,
      sortid
    ],
    getPoListAPI,
    {
      keepPreviousData: true,
    }
  );

  /* CONDITIONAL RENDERING LIFE CYCLE HOOK TO UPDATE ALL INVOICES STATE WHEN API CALL IS DONE */
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

  //handle Sorting

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setAllInvoicesConfig({
        ...allInvoicesConfig,
        sortid: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.PURCHASES}?tabIndex=all&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
      history.push(route);
    } else {
       if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setAllInvoicesRes(prev =>({...prev,  result: userData}))
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setAllInvoicesRes(prev =>({...prev,  result: userData}))
      }
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
      }?tabIndex=all&sortid=${
        sorter && sorter.order === 'descend'
          ? `-${sorter.field}`
          : sorter.field
      }&page=${pagination.current}&page_size=${
        pagination.pageSize
      }&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  }

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
            'invoices',
            'transactions',
            'items?page',
            'invoice-view',
            'ledger-contact',
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
    } catch (error) {
      console.log(error);
    }
  };

  /* METHOD TO UPDATE SELECTED ROW OF TABLE */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
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
