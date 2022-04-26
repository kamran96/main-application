import deleteIcon from '@iconify/icons-carbon/delete';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import { paymentDeleteAPI, paymentIndexAPI } from '../../../api/payment';
import { ButtonTag } from '../../../components/ButtonTags';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { PDFICON } from '../../../components/Icons';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { SmartFilter } from '../../../components/SmartFilter';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IPaymentResponse,
  IServerError,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
  TRANSACTION_MODE,
} from '../../../modal';
import { useCols } from './CommonCols';
import filterSchema from './paymentFilterSchema';

export const PaymentPaidList: FC = () => {
  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;
  const queryCache = useQueryClient();

  /* Mutations */
  const { mutate: mutatePaymentDelete, isLoading: paymentDeleteLoading } =
    useMutation(paymentDeleteAPI);

  /* Mutations Ends here */
  /*  table list state to maintain list */
  const [{ result, pagination }, setPaymentResponse] =
    useState<IPaymentResponse>({
      pagination: {},
      result: [],
    });
  
  const [selectedRow, setSelectedRow] = useState([]);
  const [filterBar, setFilterbar] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const [config, setConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    sortItem: '',
    page_size: 20,
  });
  const { page, query, sortid, page_size } = config;

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `payments-list?page_no=${page}&sort=${sortid}&page_size=${page_size}&query=${query}&paymentType=payables`,
      page,
      sortid,
      page_size,
      query,
      TRANSACTION_MODE.PAYABLES,
    ],
    paymentIndexAPI,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      setPaymentResponse(resolvedData.data);
    }
  }, [resolvedData]);

  /* Payment Delete Async Function */
  const handleDeletePayment = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    mutatePaymentDelete(payload, {
      onSuccess: () => {
        setSelectedRow([]);
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Payment Deleted Successfully'
        );
        ['payments-list', 'transactions', 'invoices'].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
        });
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
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            'Check your internet connection and try again'
          );
        }
      },
    });
  };

  /* Columns Initialization */

  const { columns } = useCols();

  const handlePaymentConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      history.push(
        `/app${ISupportedRoutes.PAYMENTS}?tabIndex=paid&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
      );
      setConfig({
        ...config,
        sortid: null,
        sortItem: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        setPaymentResponse(prev =>({...prev,  result: userData}))
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
       
        setPaymentResponse(prev =>({...prev,  result: userData}))
      }
      history.push(
        `/app${ISupportedRoutes.PAYMENTS}?tabIndex=paid&sortid=${
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
  };

  /* This function returns customTopbar in the contacts table */
  /* this function is passed as a prop in the contact table */
  const renderCustomTopbar = () => {
    return (
      <div className="payment_topbar">
        <div className="options_actions">
          <div className="edit">
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
      <div className="flex aliginCenter">
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
          onClose={() => setFilterbar(false)}
          visible={filterBar}
          formSchema={filterSchema}
        />
      </div>
    );
  };

  /* Function to set selected columns to selectedRows state */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  return (
    <WrapperPaymentList>
      <CommonTable
        topbarRightPannel={renderTopbarRight()}
        hasPrint
        printTitle={'Payment Paid List'}
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
    </WrapperPaymentList>
  );
};

const WrapperPaymentList = styled.div`
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
