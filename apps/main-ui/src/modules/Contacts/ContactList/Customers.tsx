/* eslint-disable react-hooks/exhaustive-deps */
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ColumnsType } from 'antd/lib/table';
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  deleteContacts,
  getContactLedger,
  getContacts,
} from '../../../api/Contact';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ButtonTag, ConfirmModal, SmartFilter, CommonTable } from '@components';
import {
  IContactTypes,
  NOTIFICATIONTYPE,
  ReactQueryKeys,
} from '../../../modal';
import { IPagination, IServerError } from '../../../modal/base';
import { ISupportedRoutes } from '../../../modal/routing';
import FilterSchema from './FilterSchema';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { ContactListWrapper, ContactMainWrapper } from './styles';
import moneyFormat from '../../../utils/moneyFormat';
import ContactsImport from '../ContactsImport';
import { useHistory } from 'react-router-dom';
import { pdfCols } from './pdfCols';
import { NavLink } from '@components';

const defaultSortId = 'id';

export const Customers: FC = () => {
  /* HOOKS */
  /* CONTAINER STATES */
  const [sortedInfo, setSortedInfo] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);
  const [contactsResponse, setContactResponse] = useState([]);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<IPagination>({});
  const [filterBar, setFilterBar] = useState<boolean>(false);
  const [config, setConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    sortItem: '',
    page_size: 20,
  });
  const { page, query, sortid, page_size } = config;

  const queryCache = useQueryClient();

  /*  CONTAINER STATES*/

  /* Mutations */
  /* this mutation is used for deleting contacts against bunch of ids */
  const { mutate: mutateDeleteContacts, isLoading: contactDeleteLoading } =
    useMutation(deleteContacts);

  const { routeHistory, notificationCallback } = useGlobalContext();

  const history = useHistory();

  /* usePagination hook React Query */
  /* this hook fetches contact list against page number and also sorts request data against sort id */
  /* eg. sortid = name (assending) -name (descending) */

  const params: any = [
    ReactQueryKeys.CONTACTS_KEYS,
    IContactTypes.CUSTOMER,
    page,
    sortid,
    page_size,
    query,
  ];

  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(params, getContacts);

  // ********************COMPONENT LIFE CYCLE HOOKS STARTS HERE******************************

  /* ---------ComponentDidUpdate hook for updaing contactResponse state when successfully API fetches contact list data------- */
  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData.data;
      const generatedResult = [];
      result.forEach((item) => {
        generatedResult.push({ ...item, key: item.id });
      });
      setContactResponse(generatedResult);
      setPaginationData(pagination);
      if (pagination?.next === page + 1) {
        queryCache.prefetchQuery(
          [
            ReactQueryKeys.CONTACTS_KEYS,
            IContactTypes.CUSTOMER,
            page + 1,
            sortid,
            page_size,
            query,
          ],
          getContacts
        );
      }
    }
  }, [resolvedData]);

  // ---------------COMPONENT DID UPDATE WHEN SEARCH PARAMS FOUND --------------//
  useEffect(() => {
    if (routeHistory?.history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setConfig({ ...config, ...obj });
    }
  }, []);

  // ********************COMPONENT LIFE CYCLE HOOKS STARTS HERE******************************

  const handleContactsConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter?.order === 'false') {
        setConfig({
          ...config,
          sortid: null,
          sortItem: null,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
        history.push(
          `/app${ISupportedRoutes.CONTACTS}?tabIndex=customers&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
        );
      } else {
        setConfig({
          ...config,
          page: pagination.current,
          page_size: pagination.pageSize,
          sortItem: sorter?.field,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });

        setSortedInfo({
          order: sorter?.order,
          columnKey: sorter?.columnKey,
        });

        history.push(
          `/app${ISupportedRoutes.CONTACTS}?tabIndex=customers&sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&page=${pagination.current}&page_size=${
            pagination.pageSize
          }&query=${query}`
        );
      }
    } else {
      setConfig({
        ...config,
        sortid: defaultSortId,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      setSortedInfo(null);
      history.push(
        `${history?.location?.pathname}?tabIndex=customers&sortid=${defaultSortId}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
      );
    }
  };

  /* columns setup antd table */
  const columns: ColumnsType<any> = [
    {
      title: 'Contact',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo?.order,
      render: (data, row, index) => (
        <NavLink
          className="contact-name"
          to={`/app${ISupportedRoutes.CONTACTS}/${row.id}?type=customer`}
        >
          {data}
        </NavLink>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'email' && sortedInfo?.order,
    },
    {
      title: 'Company Name',
      dataIndex: 'businessName',
      key: 'businessName',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'businessName' && sortedInfo?.order,
    },
    {
      title: 'Contact Type',
      dataIndex: 'contactType',
      key: 'contactType',
      render: (data) => (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {data && data === IContactTypes.CUSTOMER
            ? 'Customer'
            : data === IContactTypes.SUPPLIER
            ? 'Supplier'
            : '-'}
        </>
      ),
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
    },
    {
      title: 'Credit Block Limit',
      dataIndex: 'creditLimitBlock',
      key: 'creditLimitBlock',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      // eslint-disable-next-line react/jsx-no-useless-fragment
      render: (data) => <>{data ? moneyFormat(data) : moneyFormat(0)}</>,
    },
  ];

  /* this Async function is responsible for delete contacts */
  const onHandleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    await mutateDeleteContacts(payload, {
      onSuccess: () => {
        ['contacts-list-customers', 'all-contacts'].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q.startsWith(key));
        });

        setConfirmModal(false);
      },
      onError: (error: IServerError) => {
        if (error?.response?.data?.message) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
        }
      },
    });
  };

  /* This function returns customTopbar in the contacts table */
  /* this function is passed as a prop in the contact table */
  const renderCustomTopbar = () => {
    return (
      <div className="contacts_search ">
        <div className="options_actions">
          <div className="edit">
            <Rbac permission={PERMISSIONS.CONTACTS_CREATE}>
              <ButtonTag
                disabled={!selectedRow.length || selectedRow.length > 1}
                onClick={() => {
                  history.push(
                    `/app${ISupportedRoutes.UPDATE_CONTACT}/${selectedRow[0]}`
                  );
                }}
                title="Edit"
                icon={editSolid}
                size={'middle'}
              />
            </Rbac>
            <Rbac permission={PERMISSIONS.CONTACTS_DELETE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length}
                onClick={() => setConfirmModal(true)}
                title="Delete"
                icon={deleteIcon}
                size={'middle'}
              />
            </Rbac>
          </div>
        </div>
      </div>
    );
  };

  const renderTopbarRight = () => {
    return (
      <div className="flex alignCenter">
        <ContactsImport />

        <SmartFilter
          onFilter={(encode) => {
            const route = `/app/contacts?tabIndex=customers&sortid=${sortid}&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setConfig({ ...config, query: encode });
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={FilterSchema}
        />
      </div>
    );
  };

  /* Function to set selected columns to selectedRows state */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  /* JSX */
  return (
    <ContactMainWrapper>
      <ContactListWrapper>
        <div className="table_container">
          <CommonTable
            onRow={(record) => {
              return {
                onMouseEnter: () => {
                  queryCache.prefetchQuery(
                    [ReactQueryKeys?.CONTACT_VIEW, record?.id, 1, '', 20, 1],
                    getContactLedger
                  );
                },
              };
            }}
            exportable
            pdfExportable={{ columns: pdfCols }}
            printTitle={'Customers List'}
            customTopbar={renderCustomTopbar()}
            topbarRightPannel={renderTopbarRight()}
            hasPrint
            data={contactsResponse}
            columns={columns}
            loading={isFetching || isLoading}
            onChange={handleContactsConfig}
            totalItems={paginationData.totalDocs}
            pagination={{
              pageSize: page_size,
              position: ['bottomRight'],
              current: paginationData.page_no,
              total: paginationData.totalDocs,
            }}
            hasfooter={true}
            onSelectRow={onSelectedRow}
            enableRowSelection
          />
        </div>
      </ContactListWrapper>
      <ConfirmModal
        loading={contactDeleteLoading}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={onHandleDelete}
        type="delete"
        text="Are you sure want to delete selected Contact?"
      />
    </ContactMainWrapper>
  );
};

export default Customers;
