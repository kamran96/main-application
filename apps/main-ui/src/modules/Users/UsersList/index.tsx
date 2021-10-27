/* eslint-disable react-hooks/exhaustive-deps */
import printIcon from '@iconify-icons/bytesize/print';
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { queryCache, useMutation, usePaginatedQuery } from 'react-query';
import styled from 'styled-components';

import {
  deleteUserAPI,
  getUsersListAPI,
  resendInvitation,
} from '../../../api/users';
import { ButtonTag } from '../../../components/ButtonTags';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { PDFICON } from '../../../components/Icons';
import { SmartFilter } from '../../../components/SmartFilter';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IProfile, NOTIFICATIONTYPE } from '../../../modal';
import { ISupportedRoutes } from '../../../modal/routing';
import { CommonTable } from './../../../components/Table';
import UserFilterSchema from './UsersFilterSchema';

interface IProps {}

export const UsersList: FC<IProps> = () => {
  const { notificationCallback } = useGlobalContext();
  const [{ result, pagination }, setUsersResponse] = useState<any>({
    result: [],
    pagination: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [mutateDeleteUser, resDeleteUser] = useMutation(deleteUserAPI);
  const [mutateResendInvitation, { isLoading: resendLoading }] =
    useMutation(resendInvitation);

  const [selectedRow, setSelectedRow] = useState([]);

  const [usersConfig, setUsersConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 20,
  });
  const [resendIndex, setResendIndex] = useState(null);

  const { page, query, sortid, page_size } = usersConfig;



  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `users-list?page=${page}page_size=${page_size}sort=${sortid}&query=${query}`,

      page,
      sortid,
      page_size,
      query,
    ],
    getUsersListAPI
  );

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
      let queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        let split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setUsersConfig({ ...usersConfig, ...obj });
    }
  }, [routeHistory, history]);

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
  };

  const handleResendInvitation = async (email, index) => {
    setResendIndex(index);
    const payload = {
      email,
    };

    await mutateResendInvitation(payload, {
      onSuccess: (data) => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          `Email sent to ${email}`
        );
        setResendIndex(null);
      },
    });
  };

  const handledelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    mutateDeleteUser(payload, {
      onSuccess: () => {
        setDeleteConfirm(false);
        queryCache.invalidateQueries((q) =>
          q.queryKey[0].toString().startsWith('users-list?page')
        );
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'User Deleted',
          'Your selected users are deleted successfuly '
        );
      },
    });
  };

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result } = resolvedData.data;
      let newResult = [];
      result.forEach((item, index) => {
        newResult.push({ ...item, key: item.id });
      });
      setUsersResponse({ ...resolvedData.data, result: newResult });
    }
  }, [resolvedData]);

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      render: (data, row, index) => <>{index + 1}</>,
    },
    {
      title: 'Username',
      dataIndex: 'profile',
      key: 'profile',
      render: (data) => <>{data?.userName || '-'}</>,
    },
    {
      title: 'Full Name',
      dataIndex: 'profile',
      key: 'profile',
      render: (data: IProfile, row, index) => <>{data?.fullName}</>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'profile',
      key: 'profile',
      render: (data, row, index) => {
        return <>{data?.phoneNumber}</>;
      },
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      key: 'role',
      render: (data, row, index) => {
        const { role } = row;
        return <>{role?.name}</>;
      },
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      key: 'role',
      render: (data, row, index) => {
        const { role } = row;
        return <>{role?.name}</>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'username',
      key: 'status',
      width: 80,
      render: (data, row, index) => (
        <>
          {data? (
            'User Active'
          ) : (
            <Button
            className="fs-12"
              loading={resendIndex === index ? resendLoading : false}
              onClick={() => handleResendInvitation(row?.email, index)}
              type="primary"
              size="small"
            >
              Resend Email
            </Button>
          )}
        </>
      ),
    },
  ];

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar flex alignCenter justifySpaceBetween flexWrap pv-10">
        <div className="edit flex alignCenter justifySpaceBetween flexWrap ">
          <div className="edit flex alignCenter">
            {true && (
              <>
                <ButtonTag
                  disabled={!selectedRow.length || selectedRow.length > 1}
                  onClick={() => {
                    history.push(
                      `/app${ISupportedRoutes.USERS}/${selectedRow[0]}`
                    );
                  }}
                  title="Edit"
                  icon={editSolid}
                  size={'middle'}
                />
                <ButtonTag
                  className="mr-10"
                  disabled={!selectedRow.length}
                  onClick={() => setDeleteConfirm(true)}
                  title="Delete"
                  icon={deleteIcon}
                  size={'middle'}
                />
                {/* <MoreActions /> */}
              </>
            )}
          </div>
        </div>
        <div className="flex alignCenter">
          <ButtonTag
            disabled={true}
            title="Print"
            size="middle"
            icon={printIcon}
          />
          <ButtonTag
            disabled
            className="mr-10"
            ghost
            title="Download PDF"
            size="middle"
            customizeIcon={<PDFICON className="flex alignCenter mr-10" />}
          />
          <SmartFilter
            onFilter={(encode) => {
              let route = `/app${ISupportedRoutes.USERS}?sortid=${sortid}&page=1&page_size=${page_size}&query=${encode}`;
              history.push(route);
              setUsersConfig({ ...usersConfig, query: encode });
            }}
            formSchema={UserFilterSchema}
          />
        </div>
      </div>
    );
  };

  return (
    <UserListWrapper>
      <div className="users_table">
        <CommonTable
          customTopbar={renderCustomTopbar()}
          data={result}
          columns={columns}
          loading={isFetching || isLoading}
          onChange={(pagination, filters, sorter: any, extra) => {
            if (sorter.order === undefined) {
              setUsersConfig({
                ...usersConfig,
                sortid: null,
                page: pagination.current,
                page_size: pagination.pageSize,
              });
              history.push(
                `/app${ISupportedRoutes.USERS}?sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
              );
            } else {
              setUsersConfig({
                ...usersConfig,
                page: pagination.current,
                page_size: pagination.pageSize,
                sortid:
                  sorter && sorter.order === 'descend'
                    ? `-${sorter.field}`
                    : sorter.field,
              });
              history.push(
                `/app${ISupportedRoutes.USERS}?sortid=${
                  sorter && sorter.order === 'descend'
                    ? `-${sorter.field}`
                    : sorter.field
                }&page=${pagination?.current}&page_size=${
                  pagination?.pageSize
                }&query=${query}`
              );
            }
          }}
          totalItems={pagination?.total}
          pagination={{
            pageSize: page_size,
            position: ["bottomRight"],
            current: typeof page==="string" ? parseInt(page) : page,
            total: pagination?.total,
          }}
          hasfooter={true}
          onSelectRow={onSelectedRow}
          enableRowSelection
        />
      </div>
      <ConfirmModal
        text={'Are you sure want to delete?'}
        loading={resDeleteUser.isLoading}
        visible={deleteConfirm}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handledelete}
      />
    </UserListWrapper>
  );
};

const UserListWrapper = styled.div`
  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
