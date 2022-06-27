import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getAllContacts, getCreditNotes } from '../../../api';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IContactTypes, IInvoiceType, ISupportedRoutes } from '../../../modal';
import { IInvoiceResponse } from '../../../modal/invoice';
import { ButtonTag } from '../../../components/ButtonTags';
import editSolid from '@iconify-icons/clarity/edit-solid';
import { SmartFilter } from '../../../components/SmartFilter';
import { PDFICON } from '../../../components/Icons';
import FilteringSchema from './FilteringSchema';
import {useCols} from './commonCols';
import { DebitNoteImport } from './DebitNoteImport';

export const DraftDebitNotes: FC = () => {
  /* HOOKS HERE */

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const { location } = history;

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
    sortid: 'id'
  });
  const { page, pageSize, sortid, query } = creditNoteConfig;

  const {columns, pdfCols } = useCols();
  /* LOCAL STATE ENDS HERE */

  /* API CALLS STACKS GOES HERE */
  /* PAGINATED QUERY TO FETCH CREDIT NOTES WITH PAGINATION */
  const { data: creditNoteListData, isLoading } = useQuery(
    [
      `credit-notes?page=${page}&type=${2}&pageSize=${pageSize}&query=${query}`,
      2, // this specifies Draft CREDIT NOTES
      page,
      pageSize,
      IInvoiceType.DEBITNOTE,
      query,
      sortid
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
        (item) => item.contactType === IContactTypes.CUSTOMER
      );
      setFilteringSchema(schema);
    }
  }, [contactsData, FilteringSchema]);


  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if(sorter.order === undefined){
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid: 'id'
      });
      const route = `/app${ISupportedRoutes.DEBIT_NOTES}?tabIndex=draft&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
      history.push(route);
    }else{
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setCreditNoteResponse(prev =>({...prev,  result: userData}))
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        
        setCreditNoteResponse(prev =>({...prev,  result: userData}))
      }
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortid: sorter && sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
      });
      const route = `/app${ISupportedRoutes.DEBIT_NOTES}?tabIndex=draft&sortid=${
        sorter && sorter.order === 'descend'
          ? `-${sorter.field}`
          : sorter.field
      }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`;
      history.push(route);
    }
  }

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
  }, [location]);
  useEffect(() => {
    if (creditNoteListData?.data?.result) {
      setCreditNoteResponse(creditNoteListData?.data);
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
        <DebitNoteImport/>
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
