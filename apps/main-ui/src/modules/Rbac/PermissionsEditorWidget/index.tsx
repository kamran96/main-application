import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Modal from "antd/lib/modal/Modal";
import React, { FC, useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { CreatePermissionsAPI, getPermissionModulesAPI } from "../../../api";
import { FormLabel } from "../../../components/FormLabel";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { AutoComplete } from "antd";
import { CommonModal } from "../../../components";

export const PermissionsEditorWidget: FC = () => {
  const {
    permissionsConfigModal,
    setPermissionConfigModal,
  } = useGlobalContext();

  const [modules, setModules] = useState([]);

  const { data: modulesResponse, isLoading: modulesFetching } = useQuery(
    ["autocomplete-modules"],
    getPermissionModulesAPI
  );

  useEffect(() => {
    if (
      
      modulesResponse?.data?.result
    ) {
      const { result } = modulesResponse.data;
      const options = result.map((item) => {
        return { value: item };
      });

      setModules(options);
    }
  }, [modulesResponse]);

  const [mutateAddPermission, resAddPermission] = useMutation(
    CreatePermissionsAPI
  );
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    await mutateAddPermission(values, {
      onSuccess: () => {
        queryCache.invalidateQueries("autocomplete-modules");
        onCancel();
      },
    });
  };

  const onCancel = () => {
    form.resetFields();
    setPermissionConfigModal(false);
  };

  return (
    <CommonModal
      title="New Permissions"
      onCancel={onCancel}
      visible={permissionsConfigModal.visibility}
      footer={false}
      width={400}
    >
      <WrapperPermissionsEditorWidget>
        <Form onFinish={onFinish}>
          <FormLabel>Title</FormLabel>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Module title is required !",
              },
            ]}
          >
            <Input size="middle" />
          </Form.Item>
          <FormLabel>Description</FormLabel>
          <Form.Item name="description">
            <TextArea rows={3} size="middle" />
          </Form.Item>
          <FormLabel>Module</FormLabel>
          <Form.Item name="module">
            <AutoComplete
              size="middle"
              options={modules}
              placeholder="eg: Contacts, Items, Users"
              filterOption={(inputValue, option) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item>
            <div className="textRight mt-20">
              <Button onClick={onCancel} className="mr-10" type="default">
                Cancel
              </Button>
              <Button
                loading={resAddPermission.isLoading}
                htmlType={"submit"}
                type="primary"
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </WrapperPermissionsEditorWidget>
    </CommonModal>
  );
};

export default PermissionsEditorWidget;

const WrapperPermissionsEditorWidget = styled.div``;
