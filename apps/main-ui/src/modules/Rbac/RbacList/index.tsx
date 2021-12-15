import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { deleteRolesAPI, getRbacListAPI } from '../../../api/rbac';
import { ButtonTag } from '../../../components/ButtonTags';
import { CommonTable } from '../../../components/Table';
import { IRolesResponse, NOTIFICATIONTYPE } from '../../../modal';
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

export const RbacList: FC = () => {
  const queryCache = useQueryClient();
  const [response, setResponse] = useState<IRolesResponse>({
    result: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const { mutate: mutateDeleteRole, isLoading: isDeletingRole } =
    useMutation(deleteRolesAPI);
  const { notificationCallback, setRbacConfigModal } = useGlobalContext();

  const [selectedRows, setSeclectedRows] = useState([]);

  const { data: rolesListData, isLoading: rolesListLoading } = useQuery(
    [`rbac-list`],
    getRbacListAPI
  );

  useEffect(() => {
    if (rolesListData && rolesListData.data && rolesListData.data.result) {
      setResponse(rolesListData.data);
    }
  }, [rolesListData]);

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Users',
      dataIndex: '',
      key: '',
    },
    {
      title: 'Parent',
      dataIndex: 'role',
      key: 'role',
      render: (data) => <>{data ? data.name : '-'}</>,
    },
  ];

  const onSelectedRows = (item) => {
    setSeclectedRows(item.selectedRowKeys);
  };

  const customTopBar = () => {
    return (
      <div className="roles_actions">
        <div className="edit flex alignCenter">
          <ButtonTag
            disabled={!selectedRows.length || selectedRows.length > 1}
            onClick={() => setRbacConfigModal(true, selectedRows[0])}
            title="Edit"
            icon={editSolid}
            size={'middle'}
          />
          <ButtonTag
            className="mr-10"
            disabled={!selectedRows.length}
            onClick={() => setConfirmModal(true)}
            title="Delete"
            icon={deleteIcon}
            size={'middle'}
          />
        </div>
      </div>
    );
  };

  const onConfirmDelete = async () => {
    const payload = {
      ids: selectedRows,
    };
    await mutateDeleteRole(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries('rbac-list');
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Role Deleted Successfully'
        );
        setConfirmModal(false);
      },
    });
  };

  return (
    <WrapperRbacList>
      <CommonTable
        className="pv-10"
        loading={rolesListLoading}
        onSelectRow={onSelectedRows}
        enableRowSelection
        customTopbar={customTopBar()}
        hasPrint
        columns={columns}
        data={response.result.map((item) => {
          return { ...item, key: item.roleId };
        })}
      />
      <ConfirmModal
        loading={isDeletingRole}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={onConfirmDelete}
        type="delete"
        text="Are you sure want to delete selected Role"
      />
    </WrapperRbacList>
  );
};

const WrapperRbacList = styled.div``;
