/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import {
  queryCache,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "react-query";
import styled from "styled-components";

import { deletePurchaseDrafts, getAllContacts } from "../../../../../api";
import { purchaseOrderList } from "../../../../../api/purchaseOrder";
import { ConfirmModal } from "../../../../../components/ConfirmModal";
import { PERMISSIONS } from "../../../../../components/Rbac/permissions";
import { useRbac } from "../../../../../components/Rbac/useRbac";
import { SmartFilter } from "../../../../../components/SmartFilter";
import { CommonTable } from "../../../../../components/Table";
import { useGlobalContext } from "../../../../../hooks/globalContext/globalContext";
import {
  IContactType,
  IContactTypes,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
} from "../../../../../modal";
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from "../../../../../modal/invoice";
import { ISupportedRoutes } from "../../../../../modal/routing";
import { _csvColumns } from "./CommonCol";
import FilterSchema from "./PoFilterSchema";
import { PurchaseTopbar } from "./PurchaseTableTopbar";

interface IProps {
  columns?: any[];
}
export const DraftPurchaseOrdersList: FC<IProps> = ({ columns }) => {
  /* HOOKS HERE */
  /* Mutations */
  /* THIS MUTATION IS RESPONSIBLE FOR APPROVED DRAFT ORDERS */

  /* THIS MUTATION IS RESPONSIBLE FOR DELETE ORDERS */
  const [mutateDeleteOrders, resDeleteOrders] = useMutation(
    deletePurchaseDrafts
  );
  /* COMPONENT STATE MANAGEMENT HOOKS */
  const [selectedRow, setSelectedRow] = useState([]);
  const [filterBar, setFilterbar] = useState(false);
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: "",
    sortid: "",
    pageSize: 10,
  });
  const { page, query, sortid, pageSize } = allInvoicesConfig;
  const { rbac } = useRbac(null);

  const [confirmModal, setConfirmModal] = useState(false);
  const [
    { result, pagination },
    setAllInvoicesRes,
  ] = useState<IInvoiceResponse>({
    result: [],
    pagination: null,
  });

  const [filteringSchema, setFilteringSchema] = useState(FilterSchema);

  /*Query hook for  Fetching all accounts against ID */
  const { data: allContactsData } = useQuery(
    [`all-contacts`, "ALL"],
    getAllContacts
  );
  const allcontactsRes: IContactType[] =
    allContactsData && allContactsData.data && allContactsData.data.result;

  useEffect(() => {
    if (allcontactsRes && allcontactsRes.length) {
      let filteredSchema = {
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
    if (
      routeHistory &&
      routeHistory.history &&
      routeHistory.history.location &&
      routeHistory.history.location.search
    ) {
      let obj = {};
      let queryArr = history.location.search.split("?")[1].split("&");
      queryArr.forEach((item, index) => {
        let split = item.split("=");
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAllInvoicesConfig({ ...allInvoicesConfig, ...obj });
    }
  }, [routeHistory, history]);
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ********* PAGINATED QUERY FOR FETCHING DRAFT ORDERS *************** */
  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `invoices-${ORDER_TYPE.PURCAHSE_ORDER}-${INVOICETYPE.DRAFT}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      ORDER_TYPE.PURCAHSE_ORDER,
      INVOICETYPE.DRAFT,
      page,
      pageSize,
      query,
    ],
    purchaseOrderList
  );

  /* ********** METHODS HERE *************** */
  /* ************** ASYNC FUNCTION IS TO  DELETE ORDER ******** */
  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        ["invoices", "invoice-view"].forEach((key) => {
          queryCache.invalidateQueries((q) =>
            q.queryKey[0].toString().startsWith(`${key}`)
          );
        });
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, "Deleted Successfully");

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
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result } = resolvedData.data;
      const newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });

      setAllInvoicesRes({ ...resolvedData.data, result: newResult });
    }
  }, [resolvedData]);

  /* Columns are overided to add  actions column in table */
  const cols = [...columns];
  cols?.splice(8,0,{
    title: "Created By",
    dataIndex: "owner",
    key: 'owner',
    render: (data)=>(<p className="capitalize">{data?.name}</p>)
  });

  const renerTopRightbar = () => {
    return (
      <div className="flex alignCenter">
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              query: encode,
            });
            let route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=draft&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
        exportable
        exportableProps={{
          fields: _csvColumns,
          fileName: "draft-POs",
        }}
        className={"border-top-none"}
        topbarRightPannel={renerTopRightbar()}
        hasPrint
        printTitle={"Draft Purchase Orders List"}
        customTopbar={
          <PurchaseTopbar
            disabled={!selectedRow.length}
            isEditable={selectedRow.length === 1}
            isAbleToDelete={rbac.can(PERMISSIONS.PURCHASE_ORDERS_DELETE)}
            onDelete={() => {
              setConfirmModal(true);
            }}
            onEdit={() => {
              let id = selectedRow[0];
              const [filteredOrder] = result.filter((item) => item.id === id);

              if (filteredOrder && filteredOrder.invoiceType === "POE") {
                history.push(
                  `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/${id}`
                );
              } else if (filteredOrder && filteredOrder.invoiceType === "PO") {
                history.push(
                  `/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}/${id}`
                );
              }
            }}
          />
        }
        data={result}
        columns={cols}
        loading={isFetching || isLoading}
        onChange={(pagination, filters, sorter: any, extra) => {
          if (sorter.order === undefined) {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              sortid: null,
              page: pagination.current,
              pageSize: pagination.pageSize,
            });
          } else {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              page: pagination.current,
              pageSize: pagination.pageSize,
              sortid:
                sorter && sorter.order === "descend"
                  ? `-${sorter.field}`
                  : sorter.field,
            });
          }
        }}
        totalItems={pagination && pagination.total}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          pageSize: pageSize,
          position: ["bottomRight"],
          current: page,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
      <ConfirmModal
        loading={resDeleteOrders.isLoading}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </ALlWrapper>
  );
};

export default DraftPurchaseOrdersList;

export const ALlWrapper = styled.div``;
