import { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  getAllContacts,
  getCreditNotes,
  deleteCreditNoteAPI,
} from '../../../api';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IInvoiceType,
  IContactTypes,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  IServerError,
} from '../../../modal';
import { IInvoiceResponse } from '../../../modal/invoice';
import { ButtonTag } from '../../../components/ButtonTags';
import editSolid from '@iconify-icons/clarity/edit-solid';
import { SmartFilter } from '../../../components/SmartFilter';
import FilteringSchema from './FilteringSchema';
import deleteIcon from '@iconify/icons-carbon/delete';
import { useCols } from './commonCols';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { useHistory } from 'react-router-dom';
import { ImportCreditNote } from './ImportCreditNote';

export const AprovedCreditNotes: FC = () => {
  const queryCache = useQueryClient();
  /* HOOKS HERE */

  const { notificationCallback } = useGlobalContext();
  const history = useHistory();
  const { location } = history;
  const { columns, pdfCols, csvColumns } = useCols();

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
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  const { mutate: mutateDelete, isLoading: isDeleting } =
    useMutation(deleteCreditNoteAPI);
  const { page, pageSize, sortid, query } = creditNoteConfig;

  /* LOCAL STATE ENDS HERE */

  /* API CALLS STACKS GOES HERE */
  /* PAGINATED QUERY TO FETCH CREDIT NOTES WITH PAGINATION */
  const { data: creditNoteListData, isLoading } = useQuery(
    [
      `credit-notes?page=${page}&type=${1}&pageSize=${pageSize}&query=${query}`,
      1, // this specifies APPROVED CREDIT NOTES
      page,
      pageSize,
      IInvoiceType.CREDITNOTE,
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
    setSelectedRow(item.selectedRowKeys);
  };

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        sortid: 'id',
        pageSize: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.CREDIT_NOTES}?tabIndex=aproved&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`;
      history.push(route);
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });

        setCreditNoteResponse((prev) => ({ ...prev, result: userData }));
      } else {
        const userData = [...result].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });

        setCreditNoteResponse((prev) => ({ ...prev, result: userData }));
      }
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field,
        pageSize: pagination.pageSize,
      });

      const route = `/app${
        ISupportedRoutes.CREDIT_NOTES
      }?tabIndex=aproved&sortid=${
        sorter && sorter.order === 'descend' ? `-${sorter.field}` : sorter.field
      }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
        sorter.order
      }&query=${query}`;
      history.push(route);
    }
  };

  const handleConfirmDelete = async () => {
    await mutateDelete(
      { ids: selectedRows, type: 1 },
      {
        onSuccess: () => {
          [
            'invoices',
            'transactions',
            'items?page',
            'invoice-view',
            'ledger-contact',
            'all-items',
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) =>
              q?.queryKey[0]?.toString()?.startsWith(`${key}`)
            );
          });
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            'Deleted Successfully'
          );

          setSelectedRow([]);
          setDeleteConfirmModal(false);
        },
        onError: (error: IServerError) => {
          if (error?.response?.data?.message) {
            const { message } = error.response.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, message);
          }
        },
      }
    );
  };

  const renderCustomTableTobar = () => {
    return (
      <div className="pv-10 flex ">
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
        <ButtonTag
          disabled={selectedRows.length === 0}
          onClick={() => {
            setDeleteConfirmModal(true);
          }}
          title="Delete"
          icon={deleteIcon}
          size={'middle'}
        />
      </div>
    );
  };
  const renderTopbarRight = () => {
    return (
      <div className="flex alignCenter">
        <ImportCreditNote />
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
        exportableProps={{
          fileName: 'approved-credit-notes',
          fields: csvColumns,
        }}
        printTitle={'Credit Notes'}
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
      <ConfirmModal
        loading={isDeleting}
        visible={deleteConfirmModal}
        onCancel={() => setDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </CreditNoteWrapper>
  );
};

export default AprovedCreditNotes;
const CreditNoteWrapper = styled.div``;
