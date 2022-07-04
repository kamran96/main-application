import React, { FC } from 'react';
import styled from 'styled-components';
import { Modal, Select } from 'antd';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { Form, Input, Button } from 'antd';
import { FormLabel } from '../../../components/FormLabel';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { getALLBranches, inviteUserAPI } from '../../../api/users';
import { NOTIFICATIONTYPE, IBaseAPIError } from '../../../modal';
import { IRoles } from '../../../api/roles';
import { getRbacListAPI } from '../../../api';
import { CommonModal } from '../../../components';

const { Option } = Select;

const UserInviteModal2: FC = () => {
  const { userInviteModal, setUserInviteModal, notificationCallback } =
    useGlobalContext();
  const queryCache = useQueryClient();

  const [form] = Form.useForm();

  const { mutate: mutateInviteUser, isLoading: invitingUser } =
    useMutation(inviteUserAPI);

  const { data, isLoading: branchesLoading } = useQuery(
    [`all-branches`],
    getALLBranches,
    {
      enabled: !!userInviteModal,
    }
  );

  const { data: rolesListData, isLoading: rolesListLoading } = useQuery(
    [`rbac-list`],
    getRbacListAPI,
    {
      enabled: !!userInviteModal,
    }
  );

  const rolesResult =
    (rolesListData && rolesListData.data && rolesListData.data.result) || [];

  const allBranches = (data && data.data && data.data.result) || [];

  const handleClose = () => {
    form.resetFields();
    setUserInviteModal(false);
  };

  const onFinish = async (values) => {
    const { email, name, password, roleId, branchId, fullName } = values;

    const payload = {
      users: {
        name,
        roleId,
        password,
        branchId,
      },
      profile: {
        email,
        fullName,
      },
    };

    try {
      await mutateInviteUser(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `User Invited Successfully`
          );
          queryCache.invalidateQueries(
            `users-list?page=${1}page_size=${20}sort=${'id'}&query=${''}`
          );
          form.resetFields();
          setUserInviteModal(false);
        },
        onError: (error: IBaseAPIError) => {
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            const { message } = error.response.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, message);
          }
        },
      });
    } catch (error) {
      notificationCallback(
        NOTIFICATIONTYPE.ERROR,
        `Something went wrong please try again`
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <CommonModal
      width={400}
      title="Invite User"
      visible={userInviteModal}
      onCancel={handleClose}
      footer={false}
      okButtonProps={{ loading: false }}
    >
      <UserInviteModalWrapper>
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <FormLabel>Full Name</FormLabel>
          <Form.Item
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Full Name required !',
              },
            ]}
          >
            <Input placeholder="Eg.John Deo" size="middle" autoComplete="off" />
          </Form.Item>
          <FormLabel>Username</FormLabel>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Username required !',
              },
            ]}
          >
            <Input placeholder="Eg.John Deo" size="middle" autoComplete="off" />
          </Form.Item>
          <FormLabel>Email</FormLabel>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Email required !',
              },
            ]}
          >
            <Input size="middle" autoComplete="off" />
          </Form.Item>
          <FormLabel>Branch</FormLabel>
          <Form.Item
            name="branchId"
            rules={[{ required: true, message: 'Please select any branch' }]}
          >
            <Select
              loading={branchesLoading}
              size="middle"
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a Branch"
              optionFilterProp="children"
            >
              {allBranches.map((branch, index) => {
                return (
                  <Option key={index} value={branch.id}>
                    {branch.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <FormLabel>Role</FormLabel>
          <Form.Item
            name="roleId"
            rules={[
              {
                required: true,
                message: 'Role required !',
              },
            ]}
          >
            <Select
              size="middle"
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a Role"
              optionFilterProp="children"
            >
              {rolesResult.map((item, index) => {
                return <Option value={item.roleId}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <FormLabel>Password</FormLabel>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password Required !' }]}
          >
            <Input.Password size="middle" autoComplete="off" />
          </Form.Item>
          <Form.Item>
            <div className="actions">
              <Button
                onClick={handleClose}
                type="default"
                size="middle"
                className="mr-10"
              >
                Cancel
              </Button>
              <Button
                loading={invitingUser}
                type="primary"
                size="middle"
                htmlType="submit"
              >
                Add Users
              </Button>
            </div>
          </Form.Item>
        </Form>
      </UserInviteModalWrapper>
    </CommonModal>
  );
};

export default UserInviteModal2;

const UserInviteModalWrapper = styled.div`
  .actions {
    text-align: right;
  }

  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -22px;
  }

  .ant-form-item {
    margin-bottom: 13px;
  }
`;
