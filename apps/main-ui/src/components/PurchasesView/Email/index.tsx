/* eslint-disable react-hooks/exhaustive-deps
 */
import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import convertToRem from "../../../utils/convertToRem";
import { CancelRequest } from "../../../utils/http";
import { FormLabel } from "../../FormLabel";
import CommonModal from "../../Modal";

interface IProps {
  onSendEmail: (payload: any) => void;
  visibility: boolean;
  setVisibility: (a: boolean) => void;
}

export const EmailModal: FC<IProps> = ({
  onSendEmail,
  visibility,
  setVisibility,
}) => {
  const [form] = Form.useForm();

  const { pdfStatus, resetUPloadPDF } = useGlobalContext();
  const { sendingPDF, pdfUploaded } = pdfStatus;

  useEffect(() => {
    if (!sendingPDF && pdfUploaded) {
      setVisibility(false);
      form.resetFields();
    }
  }, [sendingPDF, pdfUploaded]);

  const onFinish = (values) => {
    onSendEmail(values);
  };

  const handleCancel = () => {
    setVisibility(false);
    form.resetFields();
  };

  return (
    <CommonModal
      title={"Email PDF"}
      footer={false}
      visible={visibility}
      onCancel={sendingPDF ? null : handleCancel}
    >
      <EmailWrapper>
        <Form form={form} onFinish={onFinish}>
          <FormLabel>Email</FormLabel>
          <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <FormLabel>Subject</FormLabel>
          <Form.Item name="subject">
            <Input />
          </Form.Item>
          <FormLabel>CC Email</FormLabel>
          <Form.Item name="cc">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
            />
          </Form.Item>
          <FormLabel>BCC Email</FormLabel>
          <Form.Item name="bcc">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
            />
          </Form.Item>
          <FormLabel>Message</FormLabel>
          <Form.Item name="message">
            <TextArea rows={4} />
          </Form.Item>
          <div className="textRight mt-35 pb-10">
            <Form.Item>
              <Button onClick={handleCancel} className="mr-10" type="default">
                Cancel
              </Button>
              <Button loading={sendingPDF} type="primary" htmlType="submit">
                Send Email
              </Button>
            </Form.Item>
          </div>
        </Form>
      </EmailWrapper>
    </CommonModal>
  );
};

const EmailWrapper = styled.div`
  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -${convertToRem(22)};
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(13)};
  }
`;
