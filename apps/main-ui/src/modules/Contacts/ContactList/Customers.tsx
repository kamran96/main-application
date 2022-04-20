/* eslint-disable react-hooks/exhaustive-deps */
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ColumnsType } from 'antd/lib/table';
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { deleteContacts, getContacts } from '../../../api/Contact';
import { ButtonTag } from '../../../components/ButtonTags';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { SmartFilter } from '../../../components/SmartFilter';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IContactTypes, NOTIFICATIONTYPE } from '../../../modal';
import { IPagination, IServerError } from '../../../modal/base';
import { ISupportedRoutes } from '../../../modal/routing';
import { CommonTable } from './../../../components/Table';
import FilterSchema from './FilterSchema';
import { ContactListWrapper, ContactMainWrapper } from './styles';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import moneyFormat from '../../../utils/moneyFormat';
import ContactsImport from '../ContactsImport';
import { useHistory } from 'react-router-dom';
import { pdfCols } from './pdfCols';

export const Customers: FC = () => {
  /* HOOKS */
  /* CONTAINER STATES */
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
    `contacts-list-customers?page_no=${page}&sort=${sortid}&page_size=${page_size}&type=${IContactTypes.CUSTOMER}&query=${query}`,
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
  }, [routeHistory]);

  const handleContactsConfig = (pagination, filters, sorter: any, extra) => {
    console.log(sorter.field, 'sorter');
    if (sorter.order === undefined) {
      history.push(
        `/app${ISupportedRoutes.CONTACTS}?tabIndex=customers&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
      );
      setConfig({
        ...config,
        sortid: null,
        sortItem: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
    } else {
      //     if(contactsResponse && sorter.order === 'descend'){
      //       const userData = contactsResponse.sort((a, b) => {
      //         if(a[sorter?.field] < b[sorter?.field]){
      //           return 1;
      //         }else{
      //           return -1
      //         }
      //       });
      //       setContactResponse(userData)
      //       // console.log(contactsResponse, "Desc")
      //     }else{
      //    const userData = contactsResponse.sort((a, b) => {
      //      if(a[sorter?.field] > b[sorter?.field]){
      //        return 1;
      //      }else{
      //        return -1
      //      }
      //    });
      //    setContactResponse(userData)
      //   //  console.log(contactsResponse, "usersData Asc")
      //  }

      history.push(
        `/app${ISupportedRoutes.CONTACTS}?tabIndex=customers&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${
          pagination.pageSize
        }&query=${query}`
      );

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
    }
  };

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



  useEffect(() => {
    if (config.sortid !== 'id' && config) {
      const sorterIdLength = sortid.split('-');
      if (contactsResponse && sorterIdLength.length >= 2) {
        const userData = contactsResponse.sort((a, b) => {
          if (a[sorterIdLength[1]] < b[sorterIdLength[1]]) {
            return 1;
          } else {
            return -1;
          }
        });
        setContactResponse(userData);
        console.log(contactsResponse, "Desc")
      } else {
        const userData = contactsResponse.sort((a, b) => {
          if (a[sorterIdLength[0]] > b[sorterIdLength[0]]) {
            return 1;
          } else {
            return -1;
          }
        });
        setContactResponse(userData);
        console.log(contactsResponse, "ASC")
      }
    }
  }, [config]);

  /* columns setup antd table */
  const columns: ColumnsType<any> = [
    {
      title: 'Contact',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (data, row, index) => (
        <Link
          className="contact-name"
          to={`/app${ISupportedRoutes.CONTACTS}/${row.id}?type=customer`}
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
    },
    {
      title: 'Company Name',
      dataIndex: 'businessName',
      key: 'businessName',
      sorter: true,
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
            pdfExportable={{ columns: pdfCols }}
            printTitle={'Customers List'}
            customTopbar={renderCustomTopbar()}
            topbarRightPannel={renderTopbarRight()}
            hasPrint
            data={contactsResponse}
            columns={columns}
            loading={isFetching || isLoading}
            onChange={handleContactsConfig}
            totalItems={paginationData.total}
            pagination={{
              pageSize: page_size,
              position: ['bottomRight'],
              current: paginationData.page_no,
              total: paginationData.total,
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
