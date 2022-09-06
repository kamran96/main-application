/* eslint-disable react-hooks/exhaustive-deps */
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { deleteContacts, getContacts } from '../../../api/Contact';
import {
  ButtonTag,
  ConfirmModal,
  SmartFilter,
  CommonTable,
  PDFICON,
} from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IContactTypes,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
} from '@invyce/shared/types';
import { IPagination, IServerError } from '../../../modal/base';
import FilterSchema from './FilterSchema';
import { ContactListWrapper, ContactMainWrapper } from './styles';
import printIcon from '@iconify-icons/bytesize/print';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import moneyFormat from '../../../utils/moneyFormat';
import { pdfCols } from './pdfCols';
import ContactsImport from '../ContactsImport';

export const Suppliers: FC = () => {
  /* HOOKS */
  /* CONTAINER STATES */
  const [sortedInfo, setsortedInfo] = useState(null);
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
  const { history } = routeHistory;

  useEffect(() => {
    if (
      routeHistory &&
      routeHistory.history &&
      routeHistory.history.location &&
      routeHistory.history.location.search
    ) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setConfig({ ...config, ...obj });

      const filterType = history.location.search.split('&');
      const filterIdType = filterType[1];
      const filterOrder = filterType[4]?.split('=')[1];

      if (filterIdType?.includes('-')) {
        const fieldName = filterIdType?.split('=')[1].split('-')[1];
        setsortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      } else {
        const fieldName = filterIdType?.split('=')[1];
        setsortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      }
    }
  }, [routeHistory]);

  const handleContactsConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      history.push(
        `/app${ISupportedRoutes.CONTACTS}?tabIndex=suppliers&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${sorter.order}&query=${query}`
      );
      setConfig({
        ...config,
        sortid: null,
        sortItem: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
    } else {
      if (sorter?.order === 'ascend') {
        const userData = [...contactsResponse].sort((a, b) => {
          if (a[sorter?.field] > b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        setContactResponse(userData);
      } else {
        const userData = [...contactsResponse].sort((a, b) => {
          if (a[sorter?.field] < b[sorter?.field]) {
            return 1;
          } else {
            return -1;
          }
        });
        setContactResponse(userData);
      }
      setConfig({
        ...config,
        sortItem: sorter.field,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field,
      });

      history.push(
        `/app${ISupportedRoutes.CONTACTS}?tabIndex=suppliers&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${pagination.pageSize}&filter=${
          sorter.order
        }&query=${query}`
      );
    }
  };

  /* usePagination hook React Query */
  /* this hook fetches contact list against page number and also sorts request data against sort id */
  /* eg. sortid = name (assending) -name (descending) */
  const params: any = [
    `contacts-list-suppliers?page_no=${page}&sort=${sortid}&page_size=${page_size}&type=${IContactTypes.SUPPLIER}&query=${query}`,
    IContactTypes.SUPPLIER,
    page,
    sortid,
    page_size,
    query,
  ];
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(params, getContacts, {
    keepPreviousData: true,
  });

  /* ComponentDidUpdate hook for updaing contactResponse state when successfully API fetches contact list data */
  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result, pagination } = resolvedData.data;
      const generatedResult = [];
      result.forEach((item) => {
        generatedResult.push({ ...item, key: item.id });
      });
      setContactResponse(generatedResult);
      setPaginationData(pagination);
    }
  }, [resolvedData]);

  /* columns setup antd table */
  const columns: ColumnsType<any> = [
    {
      title: 'Contact',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo?.order,
      render: (data, row, index) => (
        <Link
          className="contact-name"
          to={`/app${ISupportedRoutes.CONTACTS}/${row.id}?type=supplier`}
        >
          {data}
        </Link>
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
      render: (data) =>
        data && data === IContactTypes.CUSTOMER
          ? 'Customer'
          : data === IContactTypes.SUPPLIER
          ? 'Supplier'
          : '-',
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
      render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
    },
  ];

  /* this Async function is responsible for delete contacts */
  const onHandleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    await mutateDeleteContacts(payload, {
      onSuccess: () => {
        ['contacts-list-suppliers', 'all-contacts'].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
        });
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
          notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
        }
      },
    });
  };

  /* This function returns customTopbar in the contacts table */
  /* this function is passed as a prop in the contact table */
  const renderCustomTopbar = () => {
    return (
      <div className="contacts_search pv-10">
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

  /* Function to set selected columns to selectedRows state */
  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const renderTopbarRight = () => {
    return (
      <div className="flex alignCenter">
        <ContactsImport />

        <SmartFilter
          onFilter={(encode) => {
            const route = `/app/contacts?tabIndex=suppliers&sortid=${sortid}&page=1&page_size=20&query=${encode}`;
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

  /* JSX */
  return (
    <ContactMainWrapper>
      <ContactListWrapper>
        <div className="table_container">
          <CommonTable
            pdfExportable={{
              columns: pdfCols,
            }}
            exportable
            customTopbar={renderCustomTopbar()}
            topbarRightPannel={renderTopbarRight()}
            hasPrint
            printTitle={'Suppliers List'}
            data={contactsResponse}
            columns={columns}
            loading={isFetching || isLoading}
            onChange={handleContactsConfig}
            totalItems={paginationData?.total}
            pagination={{
              pageSize: page_size,
              position: ['bottomRight'],
              current: paginationData?.page_no,
              total: paginationData?.total,
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

export default Suppliers;
