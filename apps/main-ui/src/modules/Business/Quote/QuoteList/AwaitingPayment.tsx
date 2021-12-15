/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllContacts, getInvoiceListAPI } from '../../../../api';
import { SmartFilter } from '../../../../components/SmartFilter';
import { CommonTable } from '../../../../components/Table';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IInvoiceResponse,
  INVOICETYPE,
  ORDER_TYPE,
} from '../../../../modal/invoice';
import { ISupportedRoutes } from '../../../../modal/routing';
import { CommonTopbar } from '../../../Invoice/InvoiceList/CommonTopbar';
import DraftQuoteFilters from './QuotesFilters';

interface IProps {
  columns?: any[];
}
export const PaymentAwaitingQuotesList: FC<IProps> = ({ columns }) => {
  const [allInvoicesConfig, setAllInvoicesConfig] = useState({
    page: 1,
    query: '',
    sortid: '',
    pageSize: 10,
  });
  const [filterBar, setFilterBar] = useState<boolean>(false);
  const [quotesFilterSchema, setQuotesFilterSchema] =
    useState(DraftQuoteFilters);

  const [selectedRow, setSelectedRow] = useState([]);

  const [{ result, pagination }, setAllInvoicesRes] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: null,
    });

  const { page, query, sortid, pageSize } = allInvoicesConfig;

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [
      `awaiting_qoutes?page=${page}&query=${query}&sort=${sortid}&page_size=${pageSize}`,
      ORDER_TYPE.QUOTE,
      INVOICETYPE.Payment_Awaiting,
      page,
      pageSize,
      sortid,
    ],
    getInvoiceListAPI,
    {
      keepPreviousData: true,
    }
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

  const allContacts = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  useEffect(() => {
    if (
      allContacts.data &&
      allContacts.data.data &&
      allContacts.data.data.result
    ) {
      const { result } = allContacts.data.data;
      const schema = quotesFilterSchema;
      schema.contactId.value = [...result];
      setQuotesFilterSchema(schema);
    }
  }, [allContacts.data, quotesFilterSchema]);

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

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
                const route = `/app${ISupportedRoutes.QUOTE}?tabIndex=draft&sortid=${sortid}&page=1&page_size=${pageSize}&sortid=${sortid}&query=${encode}`;
                history.push(route);
              }}
              onClose={() => setFilterBar(false)}
              visible={filterBar}
              formSchema={quotesFilterSchema}
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
          const route = `/app${ISupportedRoutes.QUOTE}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
          history.push(route);
        } else {
          setAllInvoicesConfig({
            ...allInvoicesConfig,
            page: pagination.current,
            pageSize: pagination.pageSize,
            sortid:
              sorter && sorter.order === 'descend'
                ? `-${sorter.field}`
                : sorter.field,
          });
          const route = `/app${ISupportedRoutes.QUOTE}?tabIndex=draft&sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&page=${pagination.current}&page_size=${pageSize}&query=${query}`;
          history.push(route);
        }
      }}
      totalItems={pagination && pagination.total}
      pagination={{
        pageSize: pageSize,
        position: ['bottomRight'],
        current: pagination && pagination.page_no,
        total: pagination && pagination.total,
      }}
      hasfooter={true}
      onSelectRow={onSelectedRow}
      enableRowSelection
    />
  );
};
