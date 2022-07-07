import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';

import {
  deleteOrganizationAPI,
  getOrganizations,
} from '../../api/organizations';
import { ButtonTag } from '../../components/ButtonTags';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Heading } from '../../components/Heading';
import { CommonTable } from '../../components/Table';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../modal';
import { BranchesContainer } from './Branches';
import { AddOrganizationWrapper } from './styled';

export const OrganizationsList: FC = () => {
  const queryCache = useQueryClient();
  const { setOrganizationConfig, notificationCallback, refetchUser } =
    useGlobalContext();
  const [{ result }, setResponse] = useState<any>({
    result: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [orgaizationActive, setOrganizationActive] = useState(4);

  const { mutate: mutateDeleteOrganizations, isLoading: deletingOrganization } =
    useMutation(deleteOrganizationAPI);

  const { isLoading, data } = useQuery([`all-organizations`], getOrganizations);

  console.log(data, "organization Data")

  useEffect(() => {
    if (data && data.data && data.data.result) {
      setResponse(data.data);
    }
  }, [data]);

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: '',
      key: '',
      width: 50,
      render: (data, row, index) => <>{index + 1}</>,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Niche', dataIndex: 'niche', key: 'niche' },
    {
      title: 'Financial Ending',
      dataIndex: 'financialEnding',
      key: 'financialEnding',
    },
    {
      title: 'Address',
      dataIndex: 'residentialAddress',
      key: 'residentialAddress',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data, row , index) => (
          <Button
          disabled={index === orgaizationActive ? true : false}
          onClick={
            () => console.log("Item Active", index)
          }
           type="primary" size="middle">
            Active
          </Button>
      ),
    },
  ];

  const onSelectedRow = (rows) => {
    setSelectedRows(rows.selectedRowKeys);
  };

  const handleDelete = async () => {
    const payload = {
      ids: [...selectedRows],
    };

    await mutateDeleteOrganizations(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries(`all-organizations`);
        refetchUser();
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Organization Deleted');
        setConfirmModal(false);
        setSelectedRows([]);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar">
        <div className="edit">
          {selectedRows && selectedRows.length > 0 && (
            <div className="flex alignCenter ">
              {selectedRows && selectedRows.length === 1 && (
                <ButtonTag
                  onClick={() => setOrganizationConfig(true, selectedRows[0])}
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
      </div>
    );
  };

  return (
    <AddOrganizationWrapper>
      <div className="add_organizations_action flex alignCenter justifySpaceBetween">
        <Heading type="table">Your Organizations</Heading>
        <Button
          onClick={() => setOrganizationConfig(true)}
          className="ml-10"
          type="primary"
        >
          Add Organization
        </Button>
      </div>
      <CommonTable
        customTopbar={renderCustomTopbar()}
        loading={isLoading}
        data={result.map((item, index) => {
          return { ...item, key: item.id };
        })}
        columns={columns}
        pagination={false}
        totalItems={result.length}
        hasfooter={true}
        enableRowSelection
        onSelectRow={onSelectedRow}
        // expandable={{
        //   expandedRowRender: (record, index) => {
        //     // const childCategories: ITransactionItem[] =
        //     //   record.transaction_items;
        //     return (
        //       <BranchesContainer
        //         organizationid={record.id}
        //         branches={record.branches}
        //       />
        //     );
        //   },
        // }}
      />
      <ConfirmModal
        loading={deletingOrganization}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Item?"
      />
    </AddOrganizationWrapper>
  );
};
