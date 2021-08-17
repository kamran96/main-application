/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Form, Input, Row, Select } from "antd";
import React, { FC, useEffect } from "react";
import styled from "styled-components";

const { Option } = Select;

interface IProps {
  onFormChange?: (payload: any) => void;
  state: any;
  index: number;
  checkValidation?: boolean;
  onError?: (error: any) => void;
}

export const AttriForm: FC<IProps> = ({
  onFormChange,
  state,
  index,
  checkValidation,
  onError,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (state[index]) {
      form.setFieldsValue(state[index]);
    }
  }, [state[index]]);

  useEffect(() => {
    if (checkValidation) {
      form.validateFields().catch((err) => {
        onError(err);
      });
    }
  }, [checkValidation, state]);

  return (
    <WrapperAttriForm>
      <Form
        form={form}
        onValuesChange={(changedValues, allvalues) => {
          let formData = [...state];
          formData[index] = { ...formData[index], ...allvalues };
          onFormChange(formData);
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Attribute Name required !",
                },
              ]}
            >
              <Input placeholder="Attribute Name" size="middle" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              rules={[
                {
                  required: true,
                  message: "Attribute Type required !",
                },
              ]}
            >
              <Select
                size="middle"
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Type"
                optionFilterProp="children"
              >
                <Option value={"DROPDOWN"}>Dropdown</Option>
                <Option value={"INPUT"}>Input</Option>
              </Select>
            </Form.Item>
          </Col>
          {state[index] && state[index].type === "DROPDOWN" && (
            <>
              <Col span={12}>
                <Form.Item
                  name="valueType"
                  rules={[
                    {
                      required: false,
                      message: "Please mention value type !",
                    },
                  ]}
                >
                  <Select
                    size="middle"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    defaultValue="custom"
                  >
                    <Option value={"custom"}>Custom Value</Option>
                    {/* <Option value={"INPUT"}>Choose Lookup</Option> */}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="value"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please add values in this format eg: 100ml , 200ml , etc",
                    },
                  ]}
                >
                  <Input
                    size="middle"
                    placeholder={"eg: 100ml, 200ml, 250ml, 300ml etc"}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </WrapperAttriForm>
  );
};

const WrapperAttriForm = styled.div``;
