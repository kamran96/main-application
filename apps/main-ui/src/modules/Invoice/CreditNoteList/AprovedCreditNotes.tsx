import { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  getAllContacts,
  getCreditNotes,
  deleteCreditNoteAPI,
  getContactLedger,
  findInvoiceByID,
} from '../../../api';
import { CommonTable, ButtonTag, SmartFilter, ConfirmModal } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IInvoiceType,
  IContactTypes,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  IServerError,
  IInvoiceResponse,
  ReactQueryKeys,
} from '@invyce/shared/types';
import editSolid from '@iconify-icons/clarity/edit-solid';
import FilteringSchema from './FilteringSchema';
import deleteIcon from '@iconify/icons-carbon/delete';
import { useCols } from './commonCols';
import { useHistory } from 'react-router-dom';
import { ImportCreditNote } from './ImportCreditNote';

const defaultSortedId = 'id';

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

  // `credit-notes?page=${page}&type=${1}&pageSize=${pageSize}&query=${query}`,
  const { data: creditNoteListData, isLoading } = useQuery(
    [
      ReactQueryKeys?.CREDITNOTE_KEYS,
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
  }, []);

  useEffect(() => {
    if (creditNoteListData?.data) {
      setCreditNoteResponse(creditNoteListData?.data);

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys?.CREDITNOTE_KEYS,
            1, // this specifies APPROVED CREDIT NOTES
            page + 1,
            pageSize,
            IInvoiceType.CREDITNOTE,
            query,
            sortid,
          ],
          getCreditNotes
        );
      }
    }
  }, [creditNoteListData?.data]);
  /* COMPONENT DID UPDATE HERE */

  /* HOOKS ENDS HERE */

  /* Local utility functions here */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        setCreditNoteConfig({
          ...creditNoteConfig,
          page: pagination.current,
          sortid: defaultSortedId,
          pageSize: pagination.pageSize,
        });
        const route = `/app${ISupportedRoutes.CREDIT_NOTES}?tabIndex=aproved&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
        history.push(route);
      } else {
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
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${
          pagination.pageSize
        }&&filterOrder=${sorter?.order}&query=${query}`;
        history.push(route);
      }
    } else {
      setCreditNoteConfig({
        ...creditNoteConfig,
        page: pagination.current,
        sortid: defaultSortedId,
        pageSize: pagination.pageSize,
      });

      const route = `/app${ISupportedRoutes.CREDIT_NOTES}?tabIndex=aproved&sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`;
      history.push(route);
    }
  };

  const handleConfirmDelete = async () => {
    await mutateDelete(
      { ids: selectedRows, type: 1 },
      {
        onSuccess: () => {
          [
            ReactQueryKeys?.INVOICES_KEYS,
            ReactQueryKeys?.TRANSACTION_KEYS,
            ReactQueryKeys?.ITEMS_KEYS,
            ReactQueryKeys.INVOICE_VIEW,
            ReactQueryKeys.CONTACT_VIEW,
            'all-items',
            'ACCRECCREDIT',
            ReactQueryKeys?.CREDITNOTE_KEYS,
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
        {/* <ImportCreditNote /> */}
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
                    IInvoiceType.CREDITNOTE,
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
