import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import styled from 'styled-components';

import { activeBranchAPI, branchDeleteAPI } from '../../api';
import { ButtonTag } from '../../components/ButtonTags';
import { ConfirmModal } from '../../components/ConfirmModal';
import { CommonTable } from '../../components/Table';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../modal';
import { IBranch } from '../../modal/organization';

interface IProps {
  branches: IBranch[];
  organizationid?: number;
}

export const BranchesContainer: FC<IProps> = ({ branches, organizationid }) => {
  const queryCache = useQueryClient();
  const [selectedRows, setSelectedRows] = useState([]);
  const { setBranchModalConfig, notificationCallback, userDetails } =
    useGlobalContext();
  const [confirmModal, setConfirmModal] = useState(false);
  /* Mutations  */
  const { mutate: mutateActiveBranch, isLoading: activeBranchLoading } =
    useMutation(activeBranchAPI);

  const { mutate: mutateBranchDelete, isLoading: deletingBranch } =
    useMutation(branchDeleteAPI);

  const columns: ColumnsType<any> = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: '',
      width: 100,
      render: (data, row: IBranch, index) => {
        return (
          <Button
            loading={activeBranchLoading}
            disabled={userDetails && userDetails.branchId === row.id}
            onClick={() => handleActiveBranch(row.id, row.organizationId)}
            type="primary"
            size={'middle'}
          >
            Active
          </Button>
        );
      },
    },
  ];

  const onRowSelection = (rows) => {
    setSelectedRows(rows.selectedRowKeys);
  };

  const handleActiveBranch = async (
    branchId: number,
    organizationId: number
  ) => {
    const UserId: number = userDetails.id;
    const payload: any = {
      branchId,
      organizationId,
      UserId,
    };

    await mutateActiveBranch(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Branch Updated');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
    });
  };

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar flex alignCenter justifySpaceBetween">
        <div className="edit">
          {selectedRows && selectedRows.length > 0 && (
            <div className="flex alignCenter ">
              {selectedRows && selectedRows.length === 1 && (
                <ButtonTag
                  onClick={() =>
                    setBranchModalConfig(
                      true,
                      branches[0].organizationId,
                      selectedRows[0]
                    )
                  }
                  disabled={!selectedRows.length || selectedRows.length > 1}
                  title="Edit"
                  icon={editSolid}
                  size={'middle'}
                />
              )}
              <ButtonTag
                className="mr-10"
                disabled={!selectedRows.length}
                onClick={() => setConfirmModal(true)}
                title="Delete"
                icon={deleteIcon}
                size={'middle'}
              />
              {/* <MoreActions /> */}
            </div>
          )}
        </div>
        <div className="textRight ">
          <Button
            onClick={() => setBranchModalConfig(true, organizationid)}
            type="primary"
            ghost
            size="middle"
          >
            Add Branch
          </Button>
        </div>
      </div>
    );
  };

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRows],
    };

    await mutateBranchDelete(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries(`all-organizations`);
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Branch Deleted');
      },
    });
  };

  return (
    <WrapperBranchesContainer>
      <CommonTable
        customTopbar={renderCustomTopbar()}
        columns={columns}
        data={branches.map((item: IBranch, index: number) => {
          return { ...item, key: item.id };
        })}
        pagination={false}
        hasfooter={false}
        onSelectRow={onRowSelection}
        enableRowSelection
      />
      <ConfirmModal
        loading={deletingBranch}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Item?"
      />
    </WrapperBranchesContainer>
  );
};

const WrapperBranchesContainer = styled.div``;
