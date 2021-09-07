import React, { FC, useEffect, useState } from "react";
import { Form, Input, Select, Tabs } from "antd";
import styled from "styled-components";
import { FormLabel } from "../FormLabel";
import { useQuery } from "react-query";
import { getBankAccounts, getBanks } from "../../api/accounts";
import { PaymentMode, PaymentType } from "../../modal";
import { defaultSettings } from "./constants";
import { DatePicker } from "../DatePicker";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { Option } = Select;

interface IProps {
  initialValues?: any;
  onChange?: (payload: any) => void;
  reset?: boolean;
  issueDate?: any;
}

export const Payment: FC<IProps> = ({
  initialValues,
  onChange,
  reset,
  issueDate,
}) => {
  const [paymentMode, setPaymentMode] = useState(PaymentMode.CREDIT);
  const [banksList, setBanksList] = useState([]);
  const [initailValues, setInitialvalue] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    if (reset) {
      form.resetFields();
      setPaymentMode(PaymentMode.CREDIT);
      form.setFieldsValue({ dueDate: dayjs() });
    }
  }, [reset, form]);

  useEffect(() => {
    form.setFieldsValue({ dueDate: dayjs() });
  }, [form]);

  useEffect(() => {
    if (JSON.stringify(initialValues) !== JSON.stringify(initailValues)) {
      setInitialvalue(initialValues);
      form.setFieldsValue(initialValues);
    }
    const initialPaymentMode = initialValues.paymentMode;

    setPaymentMode((prev) => {
      if (prev !== initialPaymentMode) {
        return initialPaymentMode;
      } else {
        return prev;
      }
    });
  }, [initialValues, form, initailValues]);

  const { isLoading, data } = useQuery([`all-bank-accounts`], getBankAccounts);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      setBanksList(result);
    }
  }, [data]);

  let paymentTypeStatus = form.getFieldValue("paymentType");

  const disableDates = (current) => {
    if (issueDate) {
      return current <= dayjs(issueDate).subtract(1, "day");
    } else {
      return false;
    }
  };

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
                  style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                  placeholder="Select Type"
                  optionFilterProp="children"
                >
                  {[
                    { value: 1, name: "Bank" },
                    { value: 2, name: "Cash" },
                  ].map((type, index) => {
                    return <Option key={index} value={type.value}>{type.name}</Option>;
                  })}
                </Select>
              </Form.Item>
            </div>
            {paymentTypeStatus === PaymentType.BANK && (
              <>
                <FormLabel>
                  {paymentTypeStatus === PaymentType.BANK
                    ? "Select Bank"
                    : "Amount"}
                </FormLabel>
                <div className="pv-2">
                  <Form.Item name="bankId">
                    <Select
                      loading={isLoading}
                      size="middle"
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select Bank"
                      optionFilterProp="children"
                    >
                      {banksList.map((bank, index) => {
                        return <Option key={index} value={bank.id}>{bank.name}</Option>;
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
              <Form.Item name="amount"
               
                rules={[
                  {
                    whitespace: false
                  },
                  {
                    validator: (rule, value, callback)=>{
                      
                      let amount = form.getFieldValue('totalAmount');
                      if(parseInt(value)>amount){
                         try{
                          throw new Error(`Value should be less than ${amount}`)
                         }catch(err){
                          callback(err)
                         }
                      }
                    }  
                  }

                ]}
              >
                <Input placeholder="Enter Amount" type="number" />
              </Form.Item>
            </div>
            <FormLabel>Type</FormLabel>
            <div className="pc-v-5">
              <Form.Item name="paymentType">
                <Select
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Type"
                  optionFilterProp="children"
                >
                  {[
                    { value: 1, name: "Bank" },
                    { value: 2, name: "Cash" },
                  ].map((type, index) => {
                    return <Option key={index} value={type.value}>{type.name}</Option>;
                  })}
                </Select>
              </Form.Item>
            </div>
            {paymentTypeStatus === PaymentType.BANK && (
              <>
                <FormLabel>
                  {paymentTypeStatus === PaymentType.BANK
                    ? "Select Bank"
                    : "Amount"}
                </FormLabel>
                <div className="pv-2">
                  <Form.Item name="bankId">
                    <Select
                      size="large"
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select Bank"
                      optionFilterProp="children"
                    >
                      {banksList.map((bank, index) => {
                        return <Option key={index} value={bank.id}>{bank.name}</Option>;
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

const WrapperPayment = styled.div``;
