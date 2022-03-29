import styled from 'styled-components';
import { Form, Input, Select, Tabs } from 'antd';
import { FormLabel } from '../FormLabel';
import { DatePicker } from '../DatePicker';
import { useState } from 'react';
import { PaymentMode } from '../../modal/payment';
import dayjs from 'dayjs';
import { defaultSettings } from './constants';
import { PaymentType } from '@invyce/shared/types';
import { useQuery } from 'react-query';
import { getBankAccounts } from '../../api/accounts';

const { Option } = Select;
const { TabPane } = Tabs;
export const Payments = ({ initialValues, onChange, reset, issueDate }) => {
  const [paymentMode, setPaymentMode] = useState(PaymentMode.CREDIT);
  const [banksList, setBanksList] = useState([]);
  const [initailValues, setInitialvalue] = useState({});
  const [form] = Form.useForm();

  const { isLoading, data } = useQuery([`all-bank-accounts`], getBankAccounts);

  const paymentTypeStatus = form.getFieldValue('paymentType');
  const disableDates = (current) => {
    if (issueDate) {
      return current <= dayjs(issueDate).subtract(1, 'day');
    } else {
      return false;
    }
  };

  const PaymentWidget = () => {
    return (
      <WrapperPayment>
        <Form
          form={form}
          onValuesChange={(changedValues, allValues) => {
            onChange({ ...initialValues, ...allValues, paymentMode });
            setInitialvalue({ ...initialValues, allValues, paymentMode });
          }}
        >
          <Tabs
            onChange={(activeKey) => {
              setPaymentMode(parseInt(activeKey));
              switch (activeKey) {
                case `${PaymentMode.CREDIT}`:
                  onChange({ ...defaultSettings.credit });
                  setPaymentMode(PaymentMode.CASH);
                  break;
                case `${PaymentMode.CASH}`:
                  onChange({ ...defaultSettings.full_pay });
                  setPaymentMode(PaymentMode.CASH);
                  break;
                case `${PaymentMode.PARTIAL}`:
                  onChange({ ...defaultSettings.partial_pay });
                  setPaymentMode(PaymentMode.PARTIAL);
                  break;
                default:
                  onChange({ ...defaultSettings.credit });
                  setPaymentMode(PaymentMode.CREDIT);
                  break;
              }
            }}
            activeKey={`${paymentMode}`}
          >
            <TabPane tab="Credit Payment" key={`${PaymentMode.CREDIT}`}>
              <FormLabel>Total Amount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalAmount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Total Discount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalDiscount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Due Date</FormLabel>
              <div className="pv-2">
                <Form.Item name="dueDate">
                  <DatePicker
                    disabledDate={disableDates}
                    style={{ width: '100%' }}
                    size="middle"
                  />
                </Form.Item>
              </div>
            </TabPane>
            <TabPane tab="Full Payment" key={`${PaymentMode.CASH}`}>
              <FormLabel>Total Amount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalAmount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Total Discount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalDiscount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Type</FormLabel>
              <div className="pv-2">
                <Form.Item name="paymentType">
                  <Select
                    size="middle"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                  >
                    {[
                      { value: 1, name: 'Bank' },
                      { value: 2, name: 'Cash' },
                    ].map((type, index) => {
                      return (
                        <Option key={index} value={type.value}>
                          {type.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              {paymentTypeStatus === PaymentType.BANK && (
                <>
                  <FormLabel>
                    {paymentTypeStatus === PaymentType.BANK
                      ? 'Select Bank'
                      : 'Amount'}
                  </FormLabel>
                  <div className="pv-2">
                    <Form.Item name="bankId">
                      <Select
                        loading={isLoading}
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Bank"
                        optionFilterProp="children"
                      >
                        {banksList.map((bank, index) => {
                          return (
                            <Option key={index} value={bank.id}>
                              {bank.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </>
              )}
            </TabPane>
            <TabPane tab="Partial payment" key={`${PaymentMode.PARTIAL}`}>
              <FormLabel>Total Amount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalAmount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Total Discount</FormLabel>
              <div className="pv-2">
                <Form.Item name="totalDiscount">
                  <Input disabled />
                </Form.Item>
              </div>
              <FormLabel>Amount Paid</FormLabel>
              <div className="pv-2">
                <Form.Item
                  name="amount"
                  rules={[
                    {
                      whitespace: false,
                    },
                    {
                      validator: (rule, value, callback) => {
                        const amount = form.getFieldValue('totalAmount');
                        if (parseInt(value) > amount) {
                          try {
                            throw new Error(
                              `Value should be less than ${amount}`
                            );
                          } catch (err) {
                            callback(err);
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="Enter Amount" type="number" autoComplete="off"/>
                </Form.Item>
              </div>
              <FormLabel>Type</FormLabel>
              <div className="pc-v-5">
                <Form.Item name="paymentType">
                  <Select
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                  >
                    {[
                      { value: 1, name: 'Bank' },
                      { value: 2, name: 'Cash' },
                    ].map((type, index) => {
                      return (
                        <Option key={index} value={type.value}>
                          {type.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>
              {paymentTypeStatus === PaymentType.BANK && (
                <>
                  <FormLabel>
                    {paymentTypeStatus === PaymentType.BANK
                      ? 'Select Bank'
                      : 'Amount'}
                  </FormLabel>
                  <div className="pv-2">
                    <Form.Item name="bankId">
                      <Select
                        size="large"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Bank"
                        optionFilterProp="children"
                      >
                        {banksList.map((bank, index) => {
                          return (
                            <Option key={index} value={bank.id}>
                              {bank.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </>
              )}
            </TabPane>
          </Tabs>
        </Form>
      </WrapperPayment>
    );
  };

  return {
    PaymentWidget,
  };
};
const WrapperPayment = styled.div``;
