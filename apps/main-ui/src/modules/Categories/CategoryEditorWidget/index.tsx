import { Button, Checkbox, Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { FC, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { createCategoryAPI, getCategoryByIdAPI } from '../../../api';
import { CommonModal } from '../../../components';
import { FormLabel } from '../../../components/FormLabel';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../../modal';

const CategoryEditorWidget: FC = () => {
  const queryCache = useQueryClient();
  const [form] = Form.useForm();
  const { categoryModalConfig, setCategoryModalConfig, notificationCallback } =
    useGlobalContext();
  const { mutate: mutateCategory, isLoading: creatingCategory } =
    useMutation(createCategoryAPI);

  const { visibility, parent_id, updateId, isChild } = categoryModalConfig;

  const { data } = useQuery(
    [`category-${updateId}`, updateId],
    getCategoryByIdAPI,
    {
      enabled: !!updateId,
    }
  );

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      form.setFieldsValue({ ...result });
    }
  }, [data, form]);

  useEffect(() => {
    if (isChild && isChild === true) {
      form.setFieldsValue({ isLeaf: true });
    }
  }, [isChild, form]);

  const onFormFinish = async (values) => {
    let payload = {
      ...values,
      parentId: null,
      isNewRecord: updateId ? false : true,
    };

    if (updateId) {
      payload = { ...payload, id: updateId };
    }

    if (parent_id) {
      payload.parentId = parent_id;
    }

    try {
      await mutateCategory(payload, {
        onSuccess: () => {
          form.resetFields();
          setCategoryModalConfig(false);
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Category ${values.title} is ${updateId ? 'Updated' : 'Created'}`
          );
          if (!parent_id) {
            [
              'categories-list',
              'child-categories',
              `category-${updateId}`,
              'all-categories',
            ].forEach((key) => {
              (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
            });
          } else {
            [
              `category-${updateId}`,
              'child-categories',
              'all-categories',
            ].forEach((key) => {
              (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
            });
          }
        },
      });
    } catch (error) {
      const { message } = error.response.data;
      notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
    }
  };
  const onFormFailed = (error) => {
    console.log(error);
  };

  return (
    <CommonModal
      visible={visibility}
      onCancel={() => setCategoryModalConfig(false)}
      footer={false}
      width={500}
      title={isChild ? `Add Child Category Form` : `Add Category Form`}
    >
      <WrapperCategoryWidget>
        <Form form={form} onFinish={onFormFinish} onFinishFailed={onFormFailed}>
          <FormLabel>Title</FormLabel>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Title is required !' }]}
          >
            <Input
              size="middle"
              placeholder={'eg. Baking, Dairy, Crockery etc'}
            />
          </Form.Item>
          <FormLabel>Description</FormLabel>
          <Form.Item
            name="description"
            rules={[{ required: true, message: 'Description is required !' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="isLeaf" valuePropName="checked">
            <Checkbox>
              <span>Is leaf</span>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <div className="mv-20 textRight">
              <Button
                onClick={() => {
                  form.resetFields();
                  setCategoryModalConfig(false);
                }}
                type="default"
                className="mr-10"
              >
                Cancel
              </Button>
              <Button
                loading={creatingCategory}
                type="primary"
                htmlType="submit"
              >
                {updateId
                  ? 'Update'
                  : `${isChild ? 'Add Child' : `Add Category`}`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </WrapperCategoryWidget>
    </CommonModal>
  );
};
export default CategoryEditorWidget;

const WrapperCategoryWidget = styled.div``;
