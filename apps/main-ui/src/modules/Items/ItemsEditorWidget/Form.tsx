/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import {
  createUpdateItem,
  fetchSingleItem,
  getAllCategories,
} from '../../../api';
import { getAllAccounts } from '../../../api/accounts';
import { FormLabel } from '../../../components/FormLabel';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../../modal';
import { IAccountsResult } from '../../../modal/accounts';
import { IServerError } from '../../../modal/base';
import { ICategory, IVariants } from '../../../modal/categories';
import { ITEM_TYPE } from '../../../modal/items';
import convertToRem from '../../../utils/convertToRem';
import { DynamicForm } from './DynamicForm';

const { Option } = Select;

export const ItemsForm: FC = () => {
  /* HOOKS */
  const queryCache = useQueryClient();
  const [formData, setFormData] = useState({});
  const [attribute_values, setAttriValue] = useState([]);
  const [hasInventory, setHasInventory] = useState(false);

  /* Mutations */
  const { mutate: mutateItems, isLoading: itemCreating } =
    useMutation(createUpdateItem);
  /* user context API hook */
  const {
    itemsModalConfig,
    setItemsModalConfig,
    notificationCallback,
    setPricingModalConfig,
  } = useGlobalContext();

  const { id } = itemsModalConfig;

  const { data: categoriesData } = useQuery(
    [`all-categories`],
    getAllCategories,
    {
      enabled: itemsModalConfig.visibility,
      cacheTime: Infinity,
    }
  );

  const resolvedCategories: ICategory[] =
    (categoriesData && categoriesData.data && categoriesData.data.result) || [];

  /* Use form hook antd */
  const [form] = Form.useForm();

  const catId =
    form.isFieldTouched('categoryId') && form.getFieldValue('categoryId');

  const getVariantsWithId = (id) => {
    const [filtered] =
      resolvedCategories && resolvedCategories.filter((item) => item.id === id);
    if (filtered) {
      return filtered?.attributes;
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (catId && resolvedCategories && !id) {
      const allVariants: IVariants[] = getVariantsWithId(catId);
      const totalVariants =
        allVariants.length &&
        allVariants.map((vari, index) => {
          return { value: '', attributeId: vari.id };
        });

      setAttriValue(totalVariants);
    }
  }, [catId]);

  /*Query hook for  Fetching single contact against ID */
  const { data } = useQuery([`item-id=${id}`, id], fetchSingleItem, {
    enabled: !!id,
    onSuccess: (data) => {
      if (data?.data?.result) {
        const { result } = data.data;
        const { attribute_values } = result;
        if (attribute_values) {
          setAttriValue(attribute_values);
        }

        form.setFieldsValue({
          ...result,
          hasPricing: result.price ? true : false,
          hasCategory: result?.categoryId ? true : false,
        });
        setFormData({ result });
      }

      /* when successfully created OR updated toast will be apear */
      /* three type of parameters are passed
          first: notification type
          second: message title
          third: message description
          */

      notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Item Fetched');
    },
  });

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      const { attribute_values } = result;
      setAttriValue(attribute_values);
      form.setFieldsValue({
        ...result,
        hasPricing: result.price ? true : false,
      });
      setFormData(result);
    }
  }, [data]);

  const validateAttributes = () => {
    let hasErrors = false;
    const validation = attribute_values.map((entity) => {
      if (entity.value === '') {
        hasErrors = true;
        return { ...entity, hasError: true };
      } else {
        return { ...entity };
      }
    });
    setAttriValue(validation);
    return hasErrors;
  };

  const onFinish = async (values) => {
    console.log(values, 'values');
    if (!validateAttributes()) {
      let payload: any = {
        ...values,
        isNewRecord: true,
      };
      if (id) {
        payload = {
          ...payload,
          isNewRecord: false,
          id: id,
        };
      }

      if (values.itemType === ITEM_TYPE.PRODUCT) {
        payload = { ...payload, attribute_values: attribute_values };
      }
      await mutateItems(payload, {
        onSuccess: (response) => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            id ? 'Updated' : 'Created'
          );
          ['item-id', 'items?page', 'all-items'].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          setItemsModalConfig(false, null);
          form.resetFields();
          setFormData({});
          setAttriValue([]);
          if (payload.hasPricing && response) {
            if (response.status === 201 || response.status === 204) {
              const { status } = response;
              const { result } = response.data;
              if (id) {
                const updateRes: any = { ...result };
                delete updateRes.openingStock;
                delete updateRes.accountId;
                setPricingModalConfig(true, {
                  ...updateRes,
                  id: [updateRes.id],
                  action: 'UPDATE',
                });
              } else {
                setPricingModalConfig(true, {
                  ...result,
                  id: [result.id],
                  action: status === 201 ? 'CREATE' : 'UPDATE',
                });
              }
            }
          }
        },
        onError: (error) => {
          const err: IServerError = error;

          if (err && err.response) {
            const { message } = err.response.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
            if (message === 'Item with the specified code already exists.') {
              form.setFieldsValue({ code: '' });
              form.submit();
            }
          }
        },
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const resAllAccounts = useQuery([`all-accounts`, `ALL`], getAllAccounts, {
    enabled: itemsModalConfig.visibility,
  });
  const allLiabilitiesAcc: IAccountsResult[] =
    (resAllAccounts.data &&
      resAllAccounts.data.data &&
      resAllAccounts.data.data.result &&
      resAllAccounts.data.data.result.filter(
        (item: IAccountsResult) =>
          item?.secondary_account?.primary_account?.name === 'liability'
      )) ||
    [];

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  return (
    <WrapperItemsEditorWidget>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        onValuesChange={(changedValues, values) => {
          setFormData(values);
        }}
      >
        <Row gutter={24}>
          <Col span={12} offset={12} pull={12}>
            <FormLabel>Item Type</FormLabel>
            <Form.Item
              name="itemType"
              rules={[{ required: true, message: 'Please add your role' }]}
            >
              <Select
                size="middle"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Item"
                optionFilterProp="children"
              >
                <Option value={ITEM_TYPE.PRODUCT}>Product</Option>
                <Option value={ITEM_TYPE.SERVICE}>Service</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="pb-10">
              <Form.Item name="hasCategory" valuePropName="checked">
                <Checkbox>Has Categories</Checkbox>
              </Form.Item>
            </div>
          </Col>
          {form.getFieldValue('hasCategory') && (
            <Col span={24}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormLabel>Category</FormLabel>
                  <Form.Item
                    name="categoryId"
                    rules={[
                      { required: false, message: 'Please add your role' },
                    ]}
                  >
                    <Select
                      disabled={
                        form.getFieldValue('itemType') !== ITEM_TYPE.PRODUCT
                      }
                      size="middle"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select Item"
                      optionFilterProp="children"
                    >
                      {resolvedCategories.length &&
                        resolvedCategories.map(
                          (category: ICategory, index: number) => {
                            return (
                              <Option key={index} value={category.id}>
                                {category.title}
                              </Option>
                            );
                          }
                        )}
                    </Select>
                  </Form.Item>
                </Col>
                {resolvedCategories &&
                  form.getFieldValue('categoryId') !== null &&
                  getVariantsWithId(form.getFieldValue('categoryId')).map(
                    (vari: IVariants, index: number) => {
                      return (
                        <Col key={index} span={12}>
                          <FormLabel>{vari.title}</FormLabel>
                          <DynamicForm
                            value={
                              attribute_values[index] &&
                              attribute_values[index].value
                            }
                            onChange={(value) => {
                              const changedValue = {
                                attributeId: vari.id,
                                value: value,
                              };

                              const allValues = [...attribute_values];
                              allValues[index] = changedValue;

                              setAttriValue(allValues);
                            }}
                            item={vari}
                          />
                          {attribute_values[index] &&
                            attribute_values[index].hasError && (
                              <p className="attri_error">
                                {' '}
                                {vari.title} is required !
                              </p>
                            )}
                        </Col>
                      );
                    }
                  )}
              </Row>
            </Col>
          )}

          <Col span={12}>
            <FormLabel>Item Name</FormLabel>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please add item name' }]}
            >
              <Input placeholder="eg. milk, match" size="middle" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>Item Code</FormLabel>
            <Form.Item
              name="code"
              rules={[{ required: true, message: 'Please add item code' }]}
            >
              <Input size="middle" type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>Minimum Stock limit</FormLabel>
            <Form.Item
              name="minimumStock"
              rules={[
                { required: true, message: 'Minimum stock limit required!' },
              ]}
            >
              <InputNumber size="middle" type="text" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="pb-10">
              <Form.Item name="hasInventory" valuePropName="checked">
                <Checkbox checked={hasInventory}>Has Inventory</Checkbox>
              </Form.Item>
            </div>
          </Col>
          {!id && form.getFieldValue('hasInventory') && (
            <>
              <Col span={12}>
                <FormLabel>Opening Inventory</FormLabel>
                <Form.Item name="openingStock" rules={[{ required: false }]}>
                  <InputNumber
                    disabled={
                      form.getFieldValue('itemType') !== ITEM_TYPE.PRODUCT
                    }
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Account</FormLabel>
                <Form.Item name="targetAccount" rules={[{ required: false }]}>
                  <Select
                    size="middle"
                    disabled={
                      form.getFieldValue('itemType') !== ITEM_TYPE.PRODUCT
                    }
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Account"
                    optionFilterProp="children"
                  >
                    {allLiabilitiesAcc.length &&
                      allLiabilitiesAcc.map(
                        (acc: IAccountsResult, index: number) => {
                          return (
                            <Option key={index} value={acc.id}>
                              {acc.name}
                            </Option>
                          );
                        }
                      )}
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={24}>
            <FormLabel>Description</FormLabel>
            <Form.Item
              name="description"
              rules={[{ required: false, message: 'Please add brand name' }]}
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="hasPricing" valuePropName="checked">
              <Checkbox>Add pricing to this item</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <div className="action_buttons">
                <Button
                  onClick={() => {
                    form.resetFields();
                    setFormData({});
                    setItemsModalConfig(false, null);
                  }}
                >
                  Cancel
                </Button>
                <Button loading={itemCreating} type="primary" htmlType="submit">
                  {id ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </WrapperItemsEditorWidget>
  );
};
const WrapperItemsEditorWidget = styled.div`
  .action_buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      margin: 0 ${convertToRem(7)};
    }
  }

  .attri_error {
    margin: 0;
    color: red;
    position: relative;
    top: -18px;
    left: 1px;
  }
`;
