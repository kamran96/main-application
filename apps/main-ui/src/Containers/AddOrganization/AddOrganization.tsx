import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import {
  deleteOrganizationAPI,
  getOrganizations,
  changeOrganizationApi,
} from '../../api/organizations';
import { ConfirmModal, Heading, AddOrganizationIcon } from '@components';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../modal';
import { OrganizationCard } from './OrganizationCard';
import { AddNewOrganizationWrapper, AddOrganizationWrapper } from './styled';

export const OrganizationsList: FC = () => {
  const queryCache = useQueryClient();
  const {
    setOrganizationConfig,
    notificationCallback,
    refetchUser,
    refetchPermissions,
  } = useGlobalContext();
  const [{ result }, setResponse] = useState<any>({
    result: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const { mutate: mutateDeleteOrganizations, isLoading: deletingOrganization } =
    useMutation(deleteOrganizationAPI);

  const { isLoading, data } = useQuery([`all-organizations`], getOrganizations);

  const {
    mutate: mutateChangeOrganizationApi,
    isLoading: ChangeOrganizationLoading,
  } = useMutation(changeOrganizationApi);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      setResponse(data.data);
    }
  }, [data]);

  const HandleChangeOrganizagtion = (id) => {
    mutateChangeOrganizationApi(id, {
      onSuccess: () => {
        refetchUser();
        refetchPermissions();
        queryCache.clear();
      },
    });
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

  return (
    <AddOrganizationWrapper>
      <div className="add_organizations_action flex alignCenter justifySpaceBetween">
        <Heading type="table">Your Organizations</Heading>
      </div>
      <div className="cardWrapper">
        {result?.map((organizationItem: any, index: number) => {
          return (
            <OrganizationCard
              key={index}
              handleDelete={() => setConfirmModal(true)}
              organization={organizationItem}
              handleEdit={() =>
                setOrganizationConfig(true, organizationItem?.id)
              }
              handleActive={() =>
                HandleChangeOrganizagtion(organizationItem?.id)
              }
            />
          );
        })}

        <AddNewOrganizationWrapper onClick={() => setOrganizationConfig(true)}>
          <AddOrganizationIcon />
          <h3>Add Organization</h3>
          <p>click to Add a new organization here</p>
        </AddNewOrganizationWrapper>
      </div>

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
