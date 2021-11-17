/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { FC, useEffect } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import {
  CreateRoleAPI,
  getRbacListAPI,
  getRoleByIDAPI,
} from '../../../api/rbac';
import { CommonModal } from '../../../components';
import { FormLabel } from '../../../components/FormLabel';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IRoleRequest } from '../../../modal';
import convertToRem from '../../../utils/convertToRem';

const { Option } = Select;

export const RolesEditorWidget: FC = () => {
  const { rbacConfigModal, setRbacConfigModal } = useGlobalContext();
  const { id } = rbacConfigModal;
  const { visibility } = rbacConfigModal;
  const [mutateAddRoles, resMutateRoles] = useMutation(CreateRoleAPI);
  const [form] = Form.useForm();

  const { data: roleIdData, isLoading: roleLoading } = useQuery(
    [`role=${id}`, id],
    getRoleByIDAPI,
    {
      enabled: id,
    }
  );

  const { data: rolesListData, isLoading: rolesListLoading } = useQuery(
    [`rbac-list`],
    getRbacListAPI
  );

  const allRoles: IRoleRequest[] =
    (rolesListData && rolesListData.data && rolesListData.data.result) || [];

  useEffect(() => {
    if (roleIdData && roleIdData.data && roleIdData.data.result) {
      const { result } = roleIdData.data;
      form.setFieldsValue(result);
    }
  }, [roleIdData]);

  const onFinish = async (values) => {
    const level =
      allRoles.length &&
      allRoles.findIndex((i) => i.roleId === values.parentId);
    const roles = [...allRoles];
    roles.splice(level + 1, 0, {
      ...values,
    });
    let payload = {
      ...values,
      isNewRecord: id ? false : true,
      level: level > -1 ? level + 2 : 1,
    };

    // if (allRoles.length) {
    //   payload = {
    //     ...payload,
    //     roles: roles.map((item, index) => {
    //       return { ...item, level: index + 1 };
    //     }),
    //   };
    // }
    if (id) {
      payload = { ...payload, id };
    }
    await mutateAddRoles(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries(`rbac-list`);
        onCancel();
      },
    });
  };

  const onCancel = () => {
    form.resetFields();
    setRbacConfigModal(false);
  };

  return (
    <CommonModal
      title="New Role"
      onCancel={onCancel}
      visible={visibility}
      footer={false}
      width={400}
    >
      <WrapperRolesEditorWidget>
        <Form form={form} onFinish={onFinish}>
          <FormLabel>Name</FormLabel>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Role Name is required !',
              },
            ]}
          >
            <Input size="middle" />
          </Form.Item>
          <FormLabel>Description</FormLabel>
          <Form.Item name="description">
            <TextArea rows={3} size="middle" />
          </Form.Item>
          <FormLabel>Parent Role</FormLabel>
          <Form.Item name="parentId">
            <Select disabled={id && true} size="middle">
              {allRoles.map((item: IRoleRequest, index: number) => {
                return (
                  <Option key={index} value={item.roleId}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="textRight mt-20">
              <Button onClick={onCancel} className="mr-10" type="default">
                Cancel
              </Button>
              <Button
                loading={resMutateRoles.isLoading}
                htmlType={'submit'}
                type="primary"
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </WrapperRolesEditorWidget>
    </CommonModal>
  );
};

export default RolesEditorWidget;

const WrapperRolesEditorWidget = styled.div`
  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -${convertToRem(22)};
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(13)};
  }
`;
