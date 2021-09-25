import { Form, Space, Input, Checkbox, Button } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { CommonModal } from "../../../../components";
import trash2 from "@iconify-icons/feather/trash-2";
import { Icon } from "@iconify/react";
import { PlusOutlined } from "@ant-design/icons";
import { queryCache, useMutation, useQuery } from "react-query";
import { createTaxAPI, getTaxByIdAPI } from "../../../../api";
import { useEffect } from "react";
import { useState } from "react";

interface IProps {
  visibility: boolean;
  setVisibility: (payload: boolean) => void;
  id?: number;
}

export const TaxEditorWidget: FC<IProps> = ({
  visibility = false,
  setVisibility,
  id,
}) => {
  const [form] = Form.useForm();
  const [mutateCreateTax, resCreateTax] = useMutation(createTaxAPI);
  const [deletedIds, setDeletedIds] = useState([]);
  const formInitialValues = [
    {
      tax_component: "",
      rate: "",
      compound: false,
      id: null,
    },
  ];

  const { data: taxViewData, isLoading: taxViewLoading } = useQuery(
    [`tax-rate?id=${id}`, id],
    getTaxByIdAPI,
    {
      enabled: id,
    }
  );

  useEffect(() => {
    if (taxViewData?.data?.result) {
      form?.setFieldsValue({ ...taxViewData?.data?.result });
    }
  }, [taxViewData]);


  const resetForm = ()=>{
    form?.resetFields();
    setVisibility(false);
  }

  const onFinish = async (values) => {

    let payload = {...values, isNewRecord: id ? false : true, deleted_ids:deletedIds};

    if(id){
      payload = {...payload, id}
    }


    await mutateCreateTax(payload, {
      onSuccess: () => {
        ["tax_rate", 'tax-rate?']?.forEach((key) => {
          queryCache?.invalidateQueries((q) =>
            q.queryKey[0]?.toString().startsWith(key)
          );
        });
        resetForm()
      },
    });
  };

  return (
    <CommonModal
      visible={visibility}
      title="Add Custom Tax Rate"
      width={589}
      footer={false}
      onCancel={() => setVisibility(false)}
    >
      <WrapperTaxEditor>
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          layout={"vertical"}
        >
          <div className="form_list">
            <Form.Item name="title" label="Tax rate display title">
              <Input size="middle" placeholder="eg. Example" />
            </Form.Item>
            <Form.List name="tax_rate_items" initialValue={formInitialValues}>
              {(fields, { add, remove }) => (
                <>
                  {fields?.map((field, index) => {
                    console.log(field, "field");
                    return (
                      <Space
                        className="flex alignCenter  form-list-item"
                        key={field.key}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          label={"Tax Component"}
                          name={[field.name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "tax component is required!",
                            },
                          ]}
                        >
                          <Input placeholder={"Federal Tax"} size="middle" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label={"Rate"}
                          name={[field.name, "rate"]}
                          rules={[
                            { required: true, message: "Rate is required!" },
                          ]}
                        >
                          <Input placeholder={"4.5%"} size="middle" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          valuePropName="checked"
                          label={"Compound"}
                          name={[field.name, "compound"]}
                          rules={[
                            { required: false, message: "Rate is required!" },
                          ]}
                        >
                          <Checkbox />
                        </Form.Item>
                        <div
                          className="delete-icon flex alignCenter"
                          onClick={() => {
                            remove(field.name);
                            if (taxViewData?.data?.result) {
                              const { result } = taxViewData?.data;
                              setDeletedIds((prev) => {
                                let val = [...prev];
                                val?.push(result?.tax_rate_items[index].id);

                                return val;
                              });
                            }
                          }}
                        >
                          <Icon icon={trash2} />
                        </div>
                      </Space>
                    );
                  })}
                  <Form.Item className="add-user ">
                    <Button
                      type="primary"
                      ghost
                      onClick={() => add()}
                      size="middle"
                      icon={<PlusOutlined />}
                    >
                      Add Tax Component
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          <Form.Item className="textRight">
            <Button className="mr-10" type="default" htmlType="reset">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </WrapperTaxEditor>
    </CommonModal>
  );
};

const WrapperTaxEditor = styled.div`
  .form_list {
    min-height: 476px;
  }

  .form-list-item .ant-space-item {
    flex: 3;
  }
  .form-list-item .ant-space-item:last-child,
  .form-list-item .ant-space-item:nth-last-child(2) {
    flex: 1;
  }

  .delete-icon {
    font-size: 17px;
    color: #c4c4c4;
    cursor: pointer;
    justify-content: flex-end;
  }

  label {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    /* identical to box height */

    text-transform: capitalize;

    /* text heading color */

    color: #272727;
  }
`;
