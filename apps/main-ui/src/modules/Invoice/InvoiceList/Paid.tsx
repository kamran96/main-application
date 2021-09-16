/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  queryCache,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "react-query";

import {
  deleteInvoiceDrafts,
  getAllContacts,
  getInvoiceListAPI,
} from "../../../api";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { PDFICON } from "../../../components/Icons";
import { PurchaseListTopbar } from "../../../components/PurchasesListTopbar";
import { SmartFilter } from "../../../components/SmartFilter";
import { CommonTable } from "../../../components/Table";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { IContactTypes, IServerError, NOTIFICATIONTYPE } from "../../../modal";
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from "../../../modal/invoice";
import { ISupportedRoutes } from "../../../modal/routing";
import moneyFormat from "../../../utils/moneyFormat";
import { _exportableCols } from "./commonCol";
import InvoicesFilterSchema from "./InvoicesFilterSchema";

interface IProps {
  columns?: any[];
}
export const PaidtInvoiceList: FC<IProps> = ({ columns }) => {
  const [mutateDeleteOrders, resDeleteOrders] = useMutation(
    deleteInvoiceDrafts
  );

  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: "",
    sortid: "",
    page_size: 10,
  });
  const { page, query, sortid, page_size } = allInvoicesConfig;


  const [confirmModal, setConfirmModal] = useState(false);

  const [filterBar, setFilterBar] = useState<boolean>(false);

  const [invoiceFiltersSchema, setInvoiceFilterSchema] = useState(
    InvoicesFilterSchema
  );

  const [selectedRow, setSelectedRow] = useState([]);

  const [
    { result, pagination },
    setAllInvoicesRes,
  ] = useState<IInvoiceResponse>({
    result: [],
    pagination: null,
  });

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
  }, [routeHistory]);

  const allContacts = useQuery([`all-contacts`, "ALL"], getAllContacts);

  const cols = columns?.filter((col)=> col?.dataIndex!=="due" && col?.dataIndex!=="dueDate");
  

  useEffect(() => {
    if (
      allContacts.data &&
      allContacts.data.data &&
      allContacts.data.data.result
    ) {
      const { result } = allContacts.data.data;
      let schema = invoiceFiltersSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setInvoiceFilterSchema(schema);
    }
  }, [allContacts.data, invoiceFiltersSchema]);

  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `invoices-${ORDER_TYPE.SALE_INVOICE}-${INVOICETYPE.PAID}?page=${page}&query=${query}&sort=${sortid}&page_size=${page_size}`,
      ORDER_TYPE.SALE_INVOICE,
      INVOICETYPE.PAID,
      "PAID ",
      page,
      page_size,
      query,
    ],
    getInvoiceListAPI
  );

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

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };
    await mutateDeleteOrders(payload, {
      onSuccess: () => {
        ["invoices", "transactions?page", "items?page", "invoice-view"].forEach(
          (key) => {
            queryCache.invalidateQueries((q) =>
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
            setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
            let route = `/app${ISupportedRoutes.INVOICES}?tabIndex=paid&sortid=null&page=1&page_size=20&sortid=${sortid}&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={invoiceFiltersSchema}
        />
      </div>
    );
  };

  return (
    <>
      <CommonTable
        exportable
        exportableProps={{ fields: _exportableCols, fileName: "paid-invoices" }}
        className="border-top-none"
        topbarRightPannel={renderTobarRight()}
        hasPrint
        printTitle={"Paid Invoices"}
        customTopbar={
          <PurchaseListTopbar
            disabled={!selectedRow.length}
            isEditable={true}
            hideDeleteButton
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
        columns={cols}
        loading={isFetching || isLoading}
        onChange={(pagination, filters, sorter: any, extra) => {
          if (sorter.order === undefined) {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              sortid: null,
              page: pagination.current,
              page_size: pagination.pageSize,
            });
            let route = `/app${ISupportedRoutes.INVOICES}?tabIndex=paid&sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
            history.push(route);
          } else {
            setAllInvoicesConfig({
              ...allInvoicesConfig,
              page: pagination.current,
              page_size: pagination.pageSize,
              sortid:
                sorter && sorter.order === "descend"
                  ? `-${sorter.field}`
                  : sorter.field,
            });
            let route = `/app${
              ISupportedRoutes.INVOICES
            }?tabIndex=paid&sortid=null&page=${pagination.current}&page_size=${
              pagination.pageSize
            }&query=${query}&sortid=${
              sorter && sorter.order === "descend"
                ? `-${sorter.field}`
                : sorter.field
            }`;
            history.push(route);
          }
        }}
        totalItems={pagination && pagination.total}
        pagination={{
          pageSize: page_size,
          position: ["bottomRight"],
          current: pagination?.page_no,
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
    </>
  );
};

export default PaidtInvoiceList;
