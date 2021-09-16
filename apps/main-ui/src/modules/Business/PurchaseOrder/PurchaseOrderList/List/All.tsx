/* eslint-disable react-hooks/exhaustive-deps */
/* THIS PAGE BELONGS TO ALL PURCHASES ORDERS TAB */
import React, { FC, useEffect, useState } from "react";
import {
  queryCache,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "react-query";
import styled from "styled-components";
import { deletePurchaseDrafts, getAllContacts } from "../../../../../api";
import { CommonTable } from "../../../../../components/Table";
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from "../../../../../modal/invoice";
import convertToRem from "../../../../../utils/convertToRem";
import { SmartFilter } from "../../../../../components/SmartFilter";
import { ISupportedRoutes } from "../../../../../modal/routing";
import { useGlobalContext } from "../../../../../hooks/globalContext/globalContext";
import FilterSchema from "./PoFilterSchema";
import { ConfirmModal } from "../../../../../components/ConfirmModal";
import {
  IBaseAPIError,
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
} from "../../../../../modal";
import { PurchaseTopbar } from "./PurchaseTableTopbar";
import { purchaseOrderList } from "../../../../../api/purchaseOrder";
import { _csvColumns } from "./CommonCol";
import { PERMISSIONS } from "../../../../../components/Rbac/permissions";
import { useRbac } from "../../../../../components/Rbac/useRbac";

interface IProps {
  columns?: any[];
  activeTab?: string;
}
export const ALLPurchaseOrdersList: FC<IProps> = ({ columns, activeTab }) => {
  /* HOOKS HERE */
  /* Mutations */
  const [mutateDeleteOrders, resDeleteOrders] = useMutation(
    deletePurchaseDrafts
  );

  /* RBAC */
  const { rbac } = useRbac(null);

  /* ****** Global Context ******* */
  const { notificationCallback } = useGlobalContext();

  /*  ********** COMPONENT STATE HOOKS  *********** */
  const [filterBar, setFilterbar] = useState(false);
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: "",
    sortid: "",
    pageSize: 10,
  });
  /* ********* DESTRUCTURING ALL INVOICESCONFIG *************** */
  const { page, query, sortid, pageSize } = allInvoicesConfig;

  const [confirmModal, setConfirmModal] = useState(false);
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [selectedRow, setSelectedRow] = useState([]);
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
  const [
    { result, pagination },
    setAllInvoicesRes,
  ] = useState<IInvoiceResponse>({
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
      let queryArr = history.location.search.split("?")[1].split("&");
      queryArr.forEach((item, index) => {
        let split = item.split("=");
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAllInvoicesConfig({ ...allInvoicesConfig, ...obj });
    }
  }, [routeHistory, history]);
  /*  ////////////// - METHODS HERE - \\\\\\\\\\\\ */

  /* ******* PAGINATED QUERY TO FETCH LIST OF PURCHASES ********** */
  /* ******* ORDERS ONLY TYPE (PROCESSED PURCHASE ORDERS) ********** */
  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `invoices-${ORDER_TYPE.PURCAHSE_ORDER}-${INVOICETYPE.Approved}?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      [ORDER_TYPE.PURCAHSE_ORDER],
      "PROCESSED",
      page,
      pageSize,
      query,
    ],
    purchaseOrderList
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
            "Deleted Successfully"
          );
          [
            "invoices",
            "transactions",
            "items?page",
            "invoice-view",
            "ledger-contact",
            "all-items",
          ].forEach((key) => {
            queryCache.invalidateQueries((q) =>
              q.queryKey[0].toString().startsWith(`${key}`)
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
    } catch (error) {}
  };

  /* METHOD TO UPDATE SELECTED ROW OF TABLE */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const cols = [...columns];

  cols?.splice(8,0, {
    title: "Approved By",
    dataIndex: "owner",
    key: 'owner',
    render: (data)=>(<p className="capitalize">{data?.name}</p>)
  })

  const renerTopRightbar = () => {
    return (
      <div className="flex alignCenter">
        <SmartFilter
          onFilter={(encode) => {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              query: encode,
            });
            let route = `/app${ISupportedRoutes.PURCHASE_ORDER}?tabIndex=all&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
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
        exportable
        exportableProps={{
          fields: _csvColumns,
          fileName: "approved-purchase-orders",
        }}
        printTitle={"Approved Purchase Orders List"}
        className={"border-top-none"}
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
          pageSizeOptions: ["10", "20", "50", "100", "150"],
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
