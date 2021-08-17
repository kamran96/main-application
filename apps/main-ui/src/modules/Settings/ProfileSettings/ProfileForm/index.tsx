import { Button, Col, Form, Input, Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import styled from "styled-components";

import { getUserAPI, updateProfileAPI } from "../../../../api";
import { FormLabel } from "../../../../components/FormLabel";
import { Heading } from "../../../../components/Heading";
import { Para } from "../../../../components/Para";
import { Seprator } from "../../../../components/Seprator";
import { UploadAtachment } from "../../../../components/UploadAtachment";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { IAttachment, NOTIFICATIONTYPE } from "../../../../modal";
import convertToRem from "../../../../utils/convertToRem";

interface IProps {
  id?: number;
}

const { TextArea } = Input;

export const ProfileForm: FC<IProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [attachmentId, setAttachmentId] = useState<number>(null);
  const { notificationCallback } = useGlobalContext();
  const [attachmentData, setAttachmentData] = useState<IAttachment | any>(null);

  const [mutateUpdateProfile, responseUpdateProfile] = useMutation(
    updateProfileAPI
  );

  const onFinish = async (values) => {
    const payload = { ...values, attachmentId, userId: id };
    try {
      await mutateUpdateProfile(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            "Updated Successfully"
          );
          queryCache.invalidateQueries(`loggedInUser`);
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const { data } = useQuery([`loggedInUser`, id], getUserAPI, {
    enabled: id,
  });

  useEffect(() => {
    if (data && data.data) {
      const { profile } = data.data.result;
      form.setFieldsValue(profile);
      setAttachmentData(profile.attachment);
    }
  }, [data, form]);
  return (
    <WrapperProfileForm>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row gutter={24}>
          <Col span={20} offset={2}>
            <Row gutter={24}>
              <Col span={24}>
                <Heading type="form-inner"> Basic Information</Heading>
                <Para type="heading-description">
                  Input your profile details here
                </Para>
                <br />
              </Col>
              <Col span={24}>
                <UploadAtachment
                  onUploadSuccess={(id) => {
                    setAttachmentId(id);
                  }}
                  defaultValue={attachmentData}
                />
              </Col>
              <Col span={12}>
                <FormLabel>Full Name</FormLabel>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: "Full Name" }]}
                >
                  <Input placeholder={"Your full name"} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Job Title</FormLabel>
                <Form.Item
                  name="jobTitle"
                  rules={[{ required: true, message: "Your job title" }]}
                >
                  <Input placeholder={""} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Brief Bio</FormLabel>
                <Form.Item name="bio">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Location</FormLabel>
                <Form.Item
                  name="location"
                  rules={[{ required: true, message: "Location" }]}
                >
                  <Input placeholder={"Location"} size="large" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Heading type="form-inner">Contact Details</Heading>
                <br />
              </Col>
              <Col span={12}>
                <FormLabel>Phone Number</FormLabel>
                <Form.Item name="phoneNumber">
                  <Input placeholder={"eg.03XXXXXXXXX"} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Website</FormLabel>
                <Form.Item name="website">
                  <Input
                    placeholder={"eg: http://www.example.com"}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Seprator />
              <Col span={24}>
                <Form.Item>
                  <div className="actions-wrapper">
                    <Button
                      loading={responseUpdateProfile.isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      Update
                    </Button>
                    <Button type="default">Cancel</Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </WrapperProfileForm>
  );
};

const WrapperProfileForm: any = styled.div`
  padding: ${convertToRem(32)} 0;

  .actions-wrapper {
    padding: ${convertToRem(20)} 0;
    button {
      margin: 0 ${convertToRem(10)};
    }
  }
`;
