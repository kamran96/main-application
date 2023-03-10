import { PlusOutlined } from '@ant-design/icons';
import trash2 from '@iconify-icons/feather/trash-2';
import { Icon } from '@iconify/react';
import React, { FC, useState } from 'react';
import {
  useQueryClient,
  useMutation,
  useQuery,
  InvalidateQueryFilters,
} from 'react-query';
import styled from 'styled-components';
import { CommonModal } from '@components';
import { Button, Form, Input, Select, Space } from 'antd';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IBaseAPIError,
  IErrorMessages,
  NOTIFICATIONTYPE,
} from '@invyce/shared/types';
import {
  getALLBranches,
  inviteUserAPI,
  userCheckAPI,
  getRbacListAPI,
} from './../../../api';
import { IThemeProps } from '@invyce/shared/invyce-theme';

const { Option } = Select;
let timeOutTime: any;

export const UserInviteModal: FC = () => {
  const { userInviteModal, setUserInviteModal, notificationCallback } =
    useGlobalContext();
  const queryClient = useQueryClient();
  const formInitialValues = [
    {
      email: '',
      branchId: null,
      roleId: null,
    },
  ];

  const { mutate: mutateInviteUser, isLoading: invitingUser } =
    useMutation(inviteUserAPI);

  const { mutate: mutateUsernameAvaliable, data: usernameAvaliable } =
    useMutation(userCheckAPI);
  const [avaliablity, setAvaliablity] = useState({
    username: false,
    email: false,
  });

  // const { data, isLoading: branchesLoading } = useQuery(
  //   [`all-branches`],
  //   getALLBranches,
  //   {
  //     enabled: !!userInviteModal,
  //   }
  // );

  const { data: rolesListData, isLoading: rolesListLoading } = useQuery(
    [`rbac-list`],
    getRbacListAPI,
    {
      enabled: !!userInviteModal,
    }
  );

  const rolesResult =
    (rolesListData && rolesListData.data && rolesListData.data.result) || [];

  const [form] = Form.useForm();

  const onCancel = () => {
    form?.resetFields();
    setUserInviteModal(false);
  };

  const onFinish = async (values) => {
    mutateInviteUser(values, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, `Invited Successfully`);
        (queryClient.invalidateQueries as any)((q: any) =>
          q.startsWith(`all-branches`)
        );
        onCancel();
      },
      onError: (err: IBaseAPIError) => {
        if (err?.response?.data?.message) {
          const { message } = err?.response?.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            IErrorMessages.SERVER_ERROR
          );
        }
      },
    });
  };

  const setDangerousHTML = (html) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const checkUsernameAvaliable = async (payload, callback) => {
    const request = payload;
    clearTimeout(timeOutTime);
    timeOutTime = setTimeout(async () => {
      await mutateUsernameAvaliable(
        { ...request },
        {
          onSuccess: (data) => {
            if (!data?.data?.available) {
              callback(setDangerousHTML(data?.data?.message));
            } else {
              const accessor = Object.keys(request)[0];
              setAvaliablity({ ...avaliablity, [accessor]: true });
              callback();
            }
          },
        }
      );
    }, 400);
  };

  return (
    <CommonModal
      visible={userInviteModal}
      title="User Invite"
      width={800}
      footer={false}
      onCancel={onCancel}
    >
      <WrapperUserInviteModal>
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          layout={'vertical'}
        >
          {/* <Form.Item
            name="area"
            label="Area"
            rules={[{ required: true, message: "Missing area" }]}
          >
            <Select options={areas} onChange={handleChange} />
          </Form.Item> */}
          <div className="form-wrapper">
            <Form.List name="users" initialValue={formInitialValues}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    <div className="list-wrapper">
                      {fields.map((field) => (
                        <Space
                          className="flex alignCenter justifySpaceBetween form-list-item"
                          key={field.key}
                          align="baseline"
                        >
                          <Form.Item
                            className="email_field"
                            {...field}
                            label="Email"
                            name={[field.name, 'email']}
                            fieldKey={[field.key, 'email']}
                            rules={[
                              { required: true, message: 'Email is required!' },
                              { type: 'email', message: 'Email is invalid' },
                              {
                                validator: (rule, value, callback) => {
                                  checkUsernameAvaliable(
                                    { email: value },
                                    callback
                                  );
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="Please type Email"
                              size="middle"
                              autoComplete="off"
                            />
                          </Form.Item>
                          {/* <Form.Item
                          {...field}
                          label="Branch"
                          name={[field.name, "branchId"]}
                          fieldKey={[field.fieldKey, "branchId"]}
                          rules={[
                            { required: true, message: "Branch is required!" },
                          ]}
                        >
                          <Select
                            loading={branchesLoading}
                            size="middle"
                            showSearch
                            style={{ width: "100%" }}
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
                        </Form.Item> */}
                          <Form.Item
                            {...field}
                            label="Role"
                            name={[field.name, 'roleId']}
                            fieldKey={[field.key, 'roleId']}
                            rules={[
                              { required: true, message: 'Role is required!' },
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
                                return (
                                  <Option value={item.roleId}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>

                          <div
                            className="delete-icon flex alignCenter"
                            onClick={() => remove(field.name)}
                          >
                            <Icon icon={trash2} />
                          </div>
                        </Space>
                      ))}
                    </div>

                    <Form.Item className="add-user ">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        size="middle"
                        icon={<PlusOutlined />}
                      >
                        Add User
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          </div>
          <Form.Item className="textRight">
            <Button onClick={onCancel} className="mr-10" type="default">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </WrapperUserInviteModal>
    </CommonModal>
  );
};

export default UserInviteModal;

const WrapperUserInviteModal = styled.div`
  .list-wrapper {
    min-height: 400px;
    max-height: 600px;
    padding-bottom: 30px;
    overflow-y: auto;
  }

  .ant-space-item {
    width: 100%;
  }
  .ant-space-item:last-child {
    width: auto;
  }
  .email_field {
    min-width: 310px;
  }

  .delete-icon svg {
    font-size: 20px;
    color: #7b7b7b;
    cursor: pointer;
  }

  .form-wrapper {
    min-height: 340px;
  }

  .form-list-item {
    background: ${(props: IThemeProps) => props?.theme?.colors?.layoutBg};
    padding: 3px 15px;
    border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.layoutBg};
    margin: 6px 0;
  }
  .form-list-item:nth-child(even) {
    background: #143c6905;
    padding: 3px 15px;
  }

  .add-user {
    margin-top: 10px;
  }
`;
