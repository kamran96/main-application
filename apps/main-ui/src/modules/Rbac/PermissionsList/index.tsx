import { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import editSolid from '@iconify-icons/clarity/edit-solid';
import deleteIcon from '@iconify/icons-carbon/delete';
import { deletePermissionAPI, getPermissionsListAPI } from '../../../api/rbac';
import { ButtonTag } from '../../../components/ButtonTags';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../modal';
import { IPermissionsResponsse } from '../../../modal/rbac';
import { ConfirmModal } from '../../../components/ConfirmModal';

export const PermissionList: FC = () => {
  const queryCache = useQueryClient();
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [{ result, pagination }, setPermissionResponse] =
    useState<IPermissionsResponsse>({
      result: [],
    });
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [permissionsConfig, setPermissionsConfig] = useState({
    page: 1,
    pageSize: 20,
  });
  const { page, pageSize } = permissionsConfig;

  /* API CALLS Queries */

  const { mutate: mutateDeletePermission, isLoading: isDeletingPermission } =
    useMutation(deletePermissionAPI);

  const { data: permissionsListData, isLoading: modulesFetching } = useQuery(
    [`permissions-list?page=${page}&pageSize=${pageSize}`, page, pageSize],
    getPermissionsListAPI,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (
      permissionsListData &&
      permissionsListData.data &&
      permissionsListData.data.result
    ) {
      setPermissionResponse(permissionsListData.data);
    }
  }, [permissionsListData]);
  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    },
  ];

  const onDelete = async () => {
    const payload = {
      ids: selectedRows,
    };
    await mutateDeletePermission(payload, {
      onSuccess: () => {
        (queryCache.invalidateQueries as any)((q) =>
          q.startsWith(`permissions-list`)
        );
        setConfirmModal(false);
      },
    });
  };

  const onRowSelections = (item) => {
    setSelectedRows(item.selectedRowKeys);
  };

  const handlePermissionsConfig = (pagination, filters, sorter: any, extra) => {
    history.push(
      `/app${ISupportedRoutes.SETTINGS}${ISupportedRoutes.PERMISSION_SETTINGS}?&page=${pagination.current}&page_size=${pagination.pageSize}`
    );
    setPermissionsConfig({
      ...permissionsConfig,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const renderCustomTopbar = () => {
    return (
      <div className="contacts_search mv-10">
        <div className="options_actions ">
          <div className="edit flex alignCenter ">
            <ButtonTag
              disabled={true}
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
      </div>
    );
  };

  return (
    <WrapperPermissionsList>
      <CommonTable
        onSelectRow={onRowSelections}
        loading={modulesFetching}
        customTopbar={renderCustomTopbar()}
        hasPrint
        exportable
        enableRowSelection
        onChange={handlePermissionsConfig}
        pagination={{
          showSizeChanger: true,
          pageSize: pagination && pagination.page_size,
          position: ['bottomRight'],
          current: pagination && pagination.page_no,
          total: pagination && pagination.total,
        }}
        hasfooter={true}
        totalItems={pagination && pagination.total}
        data={
          (result &&
            result.map((item, index) => {
              return { ...item, key: item.id };
            })) ||
          []
        }
        columns={columns}
      />
      <ConfirmModal
        loading={isDeletingPermission}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={onDelete}
        type="delete"
        text="Are you sure want to delete selected Permission?"
      />
    </WrapperPermissionsList>
  );
};

const WrapperPermissionsList = styled.div``;
