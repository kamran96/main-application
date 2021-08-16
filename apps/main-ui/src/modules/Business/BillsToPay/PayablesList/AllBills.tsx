/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { usePaginatedQuery, useQuery } from "react-query";
import { getAllContacts, getInvoiceListAPI } from "../../../../api";
import { getBillsIndexAPI } from "../../../../api/bills";
import { SmartFilter } from "../../../../components/SmartFilter";
import { CommonTable } from "../../../../components/Table";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from "../../../../modal/invoice";
import { ISupportedRoutes } from "../../../../modal/routing";
import { CommonTopbar } from "../../../Invoice/InvoiceList/CommonTopbar";
import BillsFilterSchema from "./BillsFilterSchema";

interface IProps {
  columns?: any[];
}
export const ALLBillsList: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: "",
    sortid: "",
    pageSize: 10,
  });
  const [filterBar, setFilterBar] = useState<boolean>(false);
  const [billsFilersSchema, setBillsFiltersSchema] = useState(
    BillsFilterSchema
  );

  const [selectedRow, setSelectedRow] = useState([]);

  const [
    { result, pagination },
    setAllInvoicesRes,
  ] = useState<IInvoiceResponse>({
    result: [],
    pagination: null,
  });

  const { page, query, sortid, pageSize } = allInvoicesConfig;

  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `all_bills?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      "PROCESSED",
      page,
      pageSize,
      query,
    ],
    getBillsIndexAPI
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

  const allContacts = useQuery([`all-contacts`, "ALL"], getAllContacts);

  useEffect(() => {
    if (
      allContacts.data &&
      allContacts.data.data &&
      allContacts.data.data.result
    ) {
      const { result } = allContacts.data.data;
      let schema = billsFilersSchema;
      schema.contactId.value = [...result];
      setBillsFiltersSchema(schema);
    }
  }, [allContacts.data, billsFilersSchema]);

  const { routeHistory } = useGlobalContext();
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

  return (
    <CommonTable
      className="border-top-none"
      data={result}
      customTopbar={
        <CommonTopbar
          selectedRow={selectedRow}
          onFilterClick={() => setFilterBar(true)}
          renderFilter={
            <SmartFilter
              onFilter={(encode) => {
                setAllInvoicesConfig({ ...allInvoicesConfig, query: encode });
                let route = `/app${ISupportedRoutes.BILLS}?tabIndex=all&sortid=null&page=1&page_size=${pageSize}&sortid=${sortid}&query=${encode}`;
                history.push(route);
              }}
              onClose={() => setFilterBar(false)}
              visible={filterBar}
              formSchema={billsFilersSchema}
            />
          }
        />
      }
      columns={columns}
      loading={isFetching || isLoading}
      onChange={(pagination, filters, sorter: any, extra) => {
        if (sorter.order === undefined) {
          setAllInvoicesConfig({
            ...allInvoicesConfig,
            sortid: null,
            page: pagination.current,
            pageSize: pagination.pageSize,
          });
          let route = `/app${ISupportedRoutes.BILLS}?tabIndex=all&sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
          history.push(route);
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
          let route = `/app${
            ISupportedRoutes.INVOICES
          }?tabIndex=all&sortid=null&page=${
            pagination.current
          }&page_size=${pageSize}&query=${query}&sortid=${
            sorter && sorter.order === "descend"
              ? `-${sorter.field}`
              : sorter.field
          }`;
          history.push(route);
        }
      }}
      totalItems={pagination && pagination.total}
      pagination={{
        pageSize: pageSize,
        position: ["bottomRight"],
        current: page,
        total: pagination && pagination.total,
      }}
      hasfooter={true}
      onSelectRow={onSelectedRow}
      enableRowSelection
    />
  );
};
