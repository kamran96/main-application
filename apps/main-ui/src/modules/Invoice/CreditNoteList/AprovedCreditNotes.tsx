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
import { IContactTypes, ISupportedRoutes } from '../../../modal';
import { IInvoiceResponse } from '../../../modal/invoice';
import { ButtonTag } from '../../../components/ButtonTags';
import editSolid from '@iconify-icons/clarity/edit-solid';
import { SmartFilter } from '../../../components/SmartFilter';
import { PDFICON } from '../../../components/Icons';
import FilteringSchema from './FilteringSchema';
import columns, { pdfCols } from './commonCols';

export const AprovedCreditNotes: FC = () => {
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
  });
  const { page, pageSize, query } = creditNoteConfig;

  /* LOCAL STATE ENDS HERE */

  /* API CALLS STACKS GOES HERE */
  /* PAGINATED QUERY TO FETCH CREDIT NOTES WITH PAGINATION */
  const { data: creditNoteListData, isLoading } = useQuery(
    [
      `credit-notes?page=${page}&type=${1}&pageSize=${pageSize}&query=${query}`,
      1, // this specifies APPROVED CREDIT NOTES
      page,
      pageSize,
      query,
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
    console.log(item, 'what is item');

    setSelectedRow(item.selectedRowKeys);
  };

  const renderCustomTableTobar = () => {
    return (
      <div className="pv-10">
        <ButtonTag
          disabled
          onClick={() => {
            history.push(
              `/app${ISupportedRoutes.ADD_CREDIT_NOTE}/${selectedRows[0]}`
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
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app${ISupportedRoutes?.CREDIT_NOTES}?tabIndex=aproved&page=1&page_size=20&query=${encode}`;
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
        printTitle={'Credit Notes'}
        onChange={(pagination, filters, sorter: any, extra) => {
          setCreditNoteConfig({
            ...creditNoteConfig,
            page: pagination.current,
            pageSize: pagination.pageSize,
          });
          const route = `/app${ISupportedRoutes.CREDIT_NOTES}?tabIndex=aproved&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
          history.push(route);
        }}
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

export default AprovedCreditNotes;
const CreditNoteWrapper = styled.div``;
