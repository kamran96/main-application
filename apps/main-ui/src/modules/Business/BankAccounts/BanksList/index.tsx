import React, { FC, useEffect, useState } from "react";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getBankAccountsList } from "../../../../api/banks";
import { CommonTable } from "../../../../components/Table";
import { ACCOUNT_TYPES, ACCOUNT_TYPES_NAMES } from "../../../../modal/accounts";
import { IBaseAPIError } from "../../../../modal/base";
import { NOTIFICATIONTYPE } from "../../../../modal";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { TableCard } from "../../../../components/TableCard";

export const BanksList: FC = () => {
  const [responseBanks, setResponseBanks] = useState([]);
  const { notificationCallback } = useGlobalContext();
  const { isLoading, data } = useQuery([`banks-list`], getBankAccountsList, {
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

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      setResponseBanks(result);
    }
  }, [data]);

  const renderAccountTypeName = (type) => {
    switch (type) {
      case ACCOUNT_TYPES.BASIC_BANKING_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.BASIC_BANKING_ACCOUNT;
      case ACCOUNT_TYPES.CURRENT_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.CURRENT_ACCOUNT;
      case ACCOUNT_TYPES.FIXED_DEPOSIT_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.FIXED_DEPOSIT_ACCOUNT;
      case ACCOUNT_TYPES.FORIGN_CURR_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.FORIGN_CURR_ACCOUNT;
      case ACCOUNT_TYPES.RUNNING_FINANCE_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.RUNNING_FINANCE_ACCOUNT;
      case ACCOUNT_TYPES.SAVING_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.SAVING_ACCOUNT;

      default:
        return "";
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "#",
      dataIndex: "",
      key: "",
      render: (data, row, index) => <>{index + 1}</>,
    },
    {
      title: "Bank Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (data, row, index) => {
        return <>{renderAccountTypeName(data)}</>;
      },
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (data, row, index) => {
        return <>{dayjs(data).format("MMMM D, YYYY")}</>;
      },
    },
  ];

  return (
    <WrapperBanksList>
     <TableCard>
     <CommonTable
        data={responseBanks}
        columns={columns}
        loading={isLoading}
        pagination={false}
        //    onChange={
        //      handleContactsConfig
        //    }
        //    pagination={{
        //      pageSize: page_size,
        //      position: ["bottomRight"],
        //      current: paginationData.page_no,
        //      total: paginationData.total,
        //    }}
        //    hasfooter={true}
        //    onSelectRow={onSelectedRow}
        //    enableRowSelection
      />
     </TableCard>
    </WrapperBanksList>
  );
};

const WrapperBanksList = styled.div``;
