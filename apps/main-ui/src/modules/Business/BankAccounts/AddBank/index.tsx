import React, { FC, useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import styled from "styled-components";
import { FormLabel } from "../../../../components/FormLabel";
import { useMutation, useQuery, queryCache } from "react-query";
import { getBanks } from "../../../../api/accounts";
import { BANK_ACCOUNTTYPES } from "../../../../modal/accounts";
import { createBankAPI } from "../../../../api/banks";
import { CommonModal } from "../../../../components";
import { IErrorMessages, IErrorResponse, NOTIFICATIONTYPE } from "../../../../modal";

const { Option } = Select;

export const AddBankWidget: FC = () => {
  const { banksModalConfig, setBanksModalConfig, notificationCallback } = useGlobalContext();
  const [mutateBank, resMutateBank] = useMutation(createBankAPI);
  const [banksList, setBanksList] = useState([]);
  const [form] = Form.useForm();

  const { data } = useQuery([`all-banks`], getBanks);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      setBanksList(result);
    }
  }, [data]);

  const onFinish = async (values) => {
    await mutateBank(values, {
      onSuccess: () => {
        ["banks-list", "all-bank-accounts",].forEach((key) => {
          queryCache.invalidateQueries((q) =>
            q.queryKey[0].toString().startsWith(key)
          );
        });
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, "Bank Account Created")
        form.resetFields();
        setBanksModalConfig(false);
      },
      onError(err:IErrorResponse){
        if(err?.data?.message){
          notificationCallback(NOTIFICATIONTYPE.ERROR, err?.data?.message)
          
        }else{
          notificationCallback(NOTIFICATIONTYPE.ERROR, IErrorMessages.NETWORK_ERROR)

        }
      }
    });
  };

  const onFinishFailed = (error) => {
    console.log(error);
  };

  return (
    <CommonModal
      width={600}
      title="Add Bank"
      visible={banksModalConfig.visibility}
      onCancel={() => setBanksModalConfig(false)}
      okButtonProps={{ loading: false }}
      footer={false}
    >
      <WrapperAddBanks>
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row gutter={24}>
            <Col span={12}>
              <FormLabel>Bank Name</FormLabel>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please add Bank name" }]}
              >
                <Input size="large" placeholder="eg. Habib Bank Ltd." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormLabel>Account Number</FormLabel>
              <Form.Item
                name="accountNumber"
                rules={[
                  { required: true, message: "Please add Account Number" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <FormLabel>Account Type</FormLabel>
              <Form.Item
                name="accountType"
                rules={[
                  { required: true, message: "Please select Account Type" },
                ]}
              >
                <Select
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                >
                  <Option value={BANK_ACCOUNTTYPES?.CURRENT}>Current</Option>
                  <Option value={BANK_ACCOUNTTYPES?.FIXED}>Fixed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <FormLabel>Bank</FormLabel>
              <Form.Item
                name="bankId"
                rules={[{ required: true, message: "Please select bank" }]}
              >
                <Select
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Item"
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
            </Col>
            <Col span={24}>
              <Form.Item>
                <div className="textRight">
                  <Button
                    className="mr-10"
                    onClick={() => setBanksModalConfig(false)}
                    type="default"
                    size="middle"
                  >
                    Cancel
                  </Button>
                  <Button loading={resMutateBank?.isLoading} size="middle" type="primary" htmlType="submit">
                    Add bank
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </WrapperAddBanks>
    </CommonModal>
  );
};

export default AddBankWidget;

const WrapperAddBanks = styled.div``;
