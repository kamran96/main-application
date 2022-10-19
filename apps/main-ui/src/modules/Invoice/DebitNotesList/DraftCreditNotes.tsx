import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  findInvoiceByID,
  getAllContacts,
  getContactLedger,
  getCreditNotes,
} from '../../../api';
import { CommonTable, ButtonTag, SmartFilter, PDFICON } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IContactTypes,
  IInvoiceType,
  ISupportedRoutes,
  IInvoiceResponse,
  ReactQueryKeys,
} from '@invyce/shared/types';
import editSolid from '@iconify-icons/clarity/edit-solid';
import FilteringSchema from './FilteringSchema';
import { useCols } from './commonCols';
import { DebitNoteImport } from './DebitNoteImport';

const defaultSortedId = 'id';
export const DraftDebitNotes: FC = () => {
  /* HOOKS HERE */

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const { location } = history;
  const queryCache = useQueryClient();
  /* LOCATL STATES */
  const [{ result, pagination }, setCreditNoteResponse] =
    useState<IInvoiceResponse>({
      result: [],
      pagination: {},
    });
  const [_filteringSchema, setFilteringSchema] = useState(FilteringSchema);
  const [selectedRows, setSelectedRow] = useState([]);
  const [creditNoteConfig, setCreditNoteConfig] = useState({
    page: 1,
    pageSize: 20,
    query: '',
    sortid: 'id',
  });
  const { page, pageSize, sortid, query } = creditNoteConfig;

  const { columns, pdfCols } = useCols();
  /* LOCAL STATE ENDS HERE */

  /* API CALLS STACKS GOES HERE */
  /* PAGINATED QUERY TO FETCH CREDIT NOTES WITH PAGINATION */

  // `credit-notes?page=${page}&type=${2}&pageSize=${pageSize}&query=${query}`,
  const { data: creditNoteListData, isLoading } = useQuery(
    [
      ReactQueryKeys?.DEBITNOTE_KEYS,
      2, // this specifies Draft CREDIT NOTES
      page,
      pageSize,
      IInvoiceType.DEBITNOTE,
      query,
      sortid,
    ],
    getCreditNotes,
    {
      keepPreviousData: true,
    }
  );

  const { data: contactsData } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts
  );

  useEffect(() => {
    if (contactsData?.data?.result) {
      const { result } = contactsData.data;
      const schema = FilteringSchema;
      schema.contactId.value = result.filter(
        (item) => item.contactType === IContactTypes.SUPPLIER
      );
      setFilteringSchema(schema);
    }
  }, [contactsData, FilteringSchema]);

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setCreditNoteConfig({
          ...creditNoteConfig,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortid: defaultSortedId,
        });
        const route = `/app${ISupportedRoutes.DEBIT_NOTES}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
        history.push(route);
      } else {
        setCreditNoteConfig({
          ...creditNoteConfig,
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });
        const route = `/app${
          ISupportedRoutes.DEBIT_NOTES
        }?tabIndex=draft&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
          sorter.order
        }&query=${query}`;
        history.push(route);
      }
    } else {
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid: defaultSortedId,
      });
      const route = `/app${ISupportedRoutes.DEBIT_NOTES}?tabIndex=draft&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  };

  /* PAGINATED QUERY TO FETCH CREDIT NOTES WITH PAGINATION */
  /* API CALLS STACKS ENDS HERE */

  /* COMPONENT DID UPDATE HERE */
  useEffect(() => {
    if (location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setCreditNoteConfig({ ...creditNoteConfig, ...obj });
    }
  }, []);

  useEffect(() => {
    if (creditNoteListData?.data) {
      setCreditNoteResponse(creditNoteListData?.data);

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.DEBITNOTE_KEYS,
            2, // this specifies APPROVED CREDIT NOTES
            page + 1,
            pageSize,
            IInvoiceType.DEBITNOTE,
            query,
            sortid,
          ],
          getCreditNotes
        );
      }
    }
  }, [creditNoteListData]);
  /* COMPONENT DID UPDATE HERE */

  /* HOOKS ENDS HERE */

  /* Local utility functions here */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const renderCustomTableTobar = () => {
    return (
      <div className="pv-10">
        <ButtonTag
          disabled={!selectedRows?.length || selectedRows?.length > 1}
          onClick={() => {
            history.push(
              `/app${ISupportedRoutes.ADD_DEBIT_NOTE}/${selectedRows[0]}`
            );
          }}
          title="Edit"
          icon={editSolid}
          size={'middle'}
        />
      </div>
    );
  };
  const renderTopbarRight = () => {
    return (
      <div className="flex alignCenter">
        {/* <DebitNoteImport/> */}
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app${ISupportedRoutes?.DEBIT_NOTES}?tabIndex=draft&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setCreditNoteConfig({ ...creditNoteConfig, query: encode });
          }}
          formSchema={_filteringSchema}
        />
      </div>
    );
  };

  /*Local utility  functions here */

  /* JSX */
  return (
    <CreditNoteWrapper>
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
                    IInvoiceType.DEBITNOTE,
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
        pdfExportable={{ columns: pdfCols }}
        loading={isLoading}
        columns={columns}
        data={result}
        hasPrint
        customTopbar={renderCustomTableTobar()}
        topbarRightPannel={renderTopbarRight()}
        exportable
        printTitle={'Draft Debit Notes'}
        onChange={onChangePagination}
        pagination={{
          pageSize: pageSize,
          position: ['bottomRight'],
          current: pagination && pagination.page_no,
          total: pagination && pagination.total,
        }}
        totalItems={pagination && pagination.total}
        hasfooter={true}
        onSelectRow={onSelectedRow}
        enableRowSelection
      />
    </CreditNoteWrapper>
  );
};

export default DraftDebitNotes;

const CreditNoteWrapper = styled.div``;
