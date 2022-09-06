import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { FC, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { createPricingAPI, getPriceByIDAPI } from '../../../api';
import { CommonModal, FormLabel } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '@invyce/shared/types';

const { Option } = Select;

const PricingEditorWidget: FC = () => {
  const queryCache = useQueryClient();
  const { pricingModalConfig, setPricingModalConfig, notificationCallback } =
    useGlobalContext();
  const { mutate: mutateAddItemPrice, isLoading: creatingPrice } =
    useMutation(createPricingAPI);
  const [form] = Form.useForm();
  const { obj } = pricingModalConfig;

  const id = obj && obj.id ? obj.id : null;
  const pricingId = (Array.isArray(id) && id.length > 0 && id[0]) || null;

  const { data } = useQuery(
    [`price-${pricingId}`, pricingId],
    getPriceByIDAPI,
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      const salePrice = (result.salePrice && result.salePrice.toString()) || '';
      const purchasePrice =
        (result.purchasePrice && result.purchasePrice.toString()) || '';
      form.setFieldsValue({ ...result, salePrice, purchasePrice });
    }
  }, [data, form]);

  const onSubmit = async (values) => {
    let payload = {
      ...values,
      salePrice: parseFloat(values.salePrice),
      purchasePrice: parseFloat(values.purchasePrice),
    };

    if (obj !== null) {
      const { id, openingStock, accountId, action } = obj;
      if (action === 'CREATE') {
        payload = {
          ...payload,
          item_ids: id,
          openingStock,
          targetAccount: accountId,
          isNewRecord: true,
        };
      } else if (action === 'UPDATE') {
        if (id.length < 2) {
          payload = {
            ...payload,
            item_ids: id,
            isNewRecord: false,
          };
        } else {
          payload = {
            ...payload,
            item_ids: id,
            isNewRecord: false,
          };
        }
      }
    }
    try {
      await mutateAddItemPrice(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Price is ${
              obj.action === 'UPDATE' ? 'Updated' : 'Created'
            } sucessfully`
          );
          form.resetFields();
          (queryCache.invalidateQueries as any)((q) => q.startsWith('items'));
          queryCache.invalidateQueries(`all-items`);
          setPricingModalConfig(false);
          queryCache.invalidateQueries(`price-${id}`);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CommonModal
      visible={pricingModalConfig.visibility}
      onCancel={() => {
        setPricingModalConfig(false, null);
        form.resetFields();
      }}
      footer={false}
      width={612}
      title="Add Item Pricing"
    >
      <WrapperPricingModal>
        <Form onFinish={onSubmit} form={form}>
          <Row gutter={24}>
            <Col span={12} offset={12} pull={12}>
              <FormLabel isRequired>Item Pricing Type</FormLabel>
              <Form.Item
                name="priceType"
                rules={[{ required: true, message: 'Select Price Type' }]}
              >
                <Select
                  size="middle"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                >
                  <Option value={1}>General</Option>
                  {/* <Option value={2}>Reverse Pricing</Option> */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormLabel isRequired>Purchase Price</FormLabel>
              <Form.Item
                name="purchasePrice"
                rules={[
                  {
                    required: true,
                    message: 'Purcahse Price required!',
                    whitespace: false,
                  },
                ]}
              >
                <Input
                  disabled={data?.data?.result?.hasBills === true}
                  placeholder={'eg: milk, match'}
                  size="middle"
                  type="number"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormLabel isRequired>Selling Price</FormLabel>
              <Form.Item
                name="salePrice"
                rules={[
                  {
                    required: true,
                    message: 'Selling Price required!',
                    whitespace: false,
                  },
                ]}
              >
                <Input
                  placeholder={'eg: milk, match'}
                  size="middle"
                  type="number"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormLabel isRequired>Tax</FormLabel>
              <Form.Item
                name="tax"
                rules={[
                  {
                    required: false,
                    message: 'Tax required!',
                    whitespace: false,
                  },
                ]}
              >
                <Input
                  placeholder={'eg: 100 or 10%'}
                  size="middle"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormLabel isRequired>Discount</FormLabel>
              <Form.Item
                name="discount"
                rules={[
                  {
                    required: false,
                    message: 'Discount is invalidate',
                    whitespace: false,
                  },
                ]}
              >
                <Input
                  placeholder={'eg. 10% or 100'}
                  size="middle"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="actions">
                <Form.Item>
                  <Button
                    onClick={() => {
                      setPricingModalConfig(false, null);
                      form.resetFields();
                    }}
                    className="mr-10"
                    type="default"
                    size="middle"
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={creatingPrice}
                    type="primary"
                    htmlType="submit"
                    size="middle"
                  >
                    Save
                  </Button>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </WrapperPricingModal>
    </CommonModal>
  );
};

export default PricingEditorWidget;

const WrapperPricingModal = styled.div`
  .actions {
    text-align: right;
  }
`;
