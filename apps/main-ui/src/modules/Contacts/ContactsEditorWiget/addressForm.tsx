import { Col, Form, Input, InputNumber, Row } from 'antd';
import React, { FC, useEffect } from 'react';

import { FormLabel } from '../../../components/FormLabel';

interface IProps {
  item: any;
  state?: any;
  onChange: (payload: any) => void;
  index: number;
  reset: boolean;
}

export const AddressForm: FC<IProps> = ({ onChange, item, index, reset }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    }
  }, [item, form]);

  useEffect(() => {
    if (reset === true) {
      form.resetFields();
    }
  }, [reset, form]);

  return (
    <Form
      form={form}
      onValuesChange={(changedValues, values) => {
        onChange(values);
      }}
    >
      <FormLabel isRequired={true}>
        {item.addressType === 1 ? 'Postal Address' : 'Street Address'}
      </FormLabel>
      <Form.Item
        name="description"
        rules={[
          {
            required: true,
            message: 'Please provide postal address',
          },
        ]}
      >
        <Input placeholder={'Address'} size="large" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="city"
        rules={[{ required: false, message: 'Please provide Skype ID' }]}
      >
        <Input placeholder={'City/Town'} size="large" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="country"
        rules={[{ required: false, message: 'Please provide country' }]}
      >
        <Input placeholder={'Country'} size="large" autoComplete="off" />
      </Form.Item>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="postalCode"
            rules={[
              {
                required: false,
                message: 'Please provide Skype ID',
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{ width: '100%' }}
              placeholder={'Postal/ Zip Code'}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
