import deleteIcon from '@iconify/icons-carbon/delete';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import {
  getContactLedger,
  paymentDeleteAPI,
  paymentIndexAPI,
} from '../../../api';
import {
  ButtonTag,
  ConfirmModal,
  SmartFilter,
  CommonTable,
  PDFICON,
} from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import FilterSchema from './paymentFilterSchema';
import {
  IPaymentResponse,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  ReactQueryKeys,
  TRANSACTION_MODE,
} from '@invyce/shared/types';
import { useCols } from './CommonCols';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import moneyFormat from '../../../utils/moneyFormat';
import { PaymentImport } from '../PaymentsImport';

const defaultSortId = 'id';

export const PaymentRecievedList: FC = () => {
  const queryCache = useQueryClient();
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;

  const { mutate: mutatePaymentDelete, isLoading: paymentDeleteLoading } =
    useMutation(paymentDeleteAPI);

  const [{ result, pagination }, setPaymentResponse] =
    useState<IPaymentResponse>({
      pagination: {},
      result: [],
    });

  const [selectedRow, setSelectedRow] = useState([]);
  const [filterBar, setFilterBar] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const [config, setConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortId,
    sortItem: '',
    page_size: 20,
  });
  const { page, query, sortid, page_size } = config;

  // `payments-list?page_no=${page}&sort=${sortid}&page_size=${page_size}&query=${query}=paymentType=recieveables`,\
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      ReactQueryKeys.PAYMENTS_KEYS,
      page,
      sortid,
      page_size,
      query,
      TRANSACTION_MODE.RECEIVABLES,
    ],
    paymentIndexAPI,
    {
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { pagination } = resolvedData?.data;
      setPaymentResponse(resolvedData.data);
      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.PAYMENTS_KEYS,
            page + 1,
            sortid,
            page_size,
            query,
            TRANSACTION_MODE.RECEIVABLES,
          ],
          paymentIndexAPI
        );
      }
    }
  }, []);

  const handleDeletePayment = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    mutatePaymentDelete(payload, {
      onSuccess: () => {
        [
          ReactQueryKeys.PAYMENTS_KEYS,
          ReactQueryKeys?.TRANSACTION_KEYS,
          ReactQueryKeys?.INVOICES_KEYS,
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q.startsWith(`${key}`));
        });
        setSelectedRow([]);
        setConfirmModal(false);
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Payment Deleted Successfully'
        );
      },
    });
  };

  const handlePaymentConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === undefined) {
        setConfig({
          ...config,
          sortid: defaultSortId,
          sortItem: null,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
        history.push(
          `/app${ISupportedRoutes.PAYMENTS}?tabIndex=received&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
        );
      } else {
        history.push(
          `/app${ISupportedRoutes.PAYMENTS}?tabIndex=received&sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&page=${pagination.current}&page_size=${
            pagination.pageSize
          }&filter=${sorter.order}&query=${query}`
        );
        setConfig({
          ...config,
          sortItem: sorter.field,
          page: pagination.current,
          page_size: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });
      }
    } else {
      history.push(
        `/app${ISupportedRoutes.PAYMENTS}?tabIndex=received&sortid=${defaultSortId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`
      );
      setConfig({
        ...config,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid: defaultSortId,
      });
    }
  };

  const renderCustomTopbar = () => {
    return (
      <div className="payment_topbar">
        <div className="options_actions">
          <div className="edit">
            {/* {selectedRow && selectedRow.length === 1 && (
                  <ButtonTag
                    disabled={!selectedRow.length || selectedRow.length > 1}
                    title="Edit"
                    icon={editSolid}
                    size={"middle"}
                  />
                )} */}
            <Rbac permission={PERMISSIONS.PAYMENTS_DELETE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length}
                onClick={() => setConfirmModal(true)}
                title="Delete"
                icon={deleteIcon}
                size={'middle'}
              />
            </Rbac>
            {/* <MoreActions /> */}
          </div>
        </div>
      </div>
    );
  };

  const renderTopbarRight = () => {
    return (
      <div className="flex alignCenter">
        {/* <PaymentImport/> */}
        <ButtonTag
          disabled
          className="mr-10"
          ghost
          title="Download PDF"
          size="middle"
          customizeIcon={<PDFICON className="flex alignCenter mr-10" />}
        />
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app${ISupportedRoutes.PAYMENTS}?sortid=${sortid}&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setConfig({ ...config, query: encode });
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={FilterSchema}
        />
      </div>
    );
  };

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const { columns } = useCols();

  const cols = [...columns];
  cols.splice(5, 1, {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (data) => (
      <>{data ? moneyFormat(Math.abs(data)) : moneyFormat(0)}</>
    ),
  });

  return (
    <WrapperPaymentRecieved>
      <CommonTable
        onRow={(record) => {
          return {
            onMouseEnter: () => {
              queryCache.prefetchQuery(
                [ReactQueryKeys?.CONTACT_VIEW, record?.contactId, 1, '', 20, 1],
                getContactLedger
              );
            },
          };
        }}
        topbarRightPannel={renderTopbarRight()}
        hasPrint
        printTitle={'Payments Recieved List'}
        customTopbar={renderCustomTopbar()}
        data={result.map((pay) => {
          return { ...pay, key: pay.id };
        })}
        columns={columns}
        loading={isFetching || isLoading}
        onChange={handlePaymentConfig}
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
        loading={paymentDeleteLoading}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={() => handleDeletePayment()}
        type="delete"
        text="Are you sure want to delete selected Payment?"
      />
    </WrapperPaymentRecieved>
  );
};

const WrapperPaymentRecieved = styled.div`
  .payment_topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;

    .edit {
      display: flex;
      align-items: center;
    }
  }
`;
