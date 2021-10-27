import { Button, Col, Form, Input, Row, Select } from 'antd';
import { getFlag } from 'apps/main-ui/src/utils/getFlags';
import { FC, useEffect, useState } from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

import { getUserAPI, updateProfileAPI } from '../../../../api';
import { FormLabel } from '../../../../components/FormLabel';
import { Heading } from '../../../../components/Heading';
import { Para } from '../../../../components/Para';
import { Seprator } from '../../../../components/Seprator';
import { UploadAtachment } from '../../../../components/UploadAtachment';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { IAttachment, NOTIFICATIONTYPE } from '../../../../modal';
import convertToRem from '../../../../utils/convertToRem';
import phoneCodes from '../../../../utils/phoneCodes';
import en from "../../../../../../../node_modules/world_countries_lists/data/en/world.json";

const { Option } = Select;

interface IProps {
  id?: number;
}

const { TextArea } = Input;

export const ProfileForm: FC<IProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [attachmentId, setAttachmentId] = useState<number>(null);
  const { notificationCallback } = useGlobalContext();
  const [attachmentData, setAttachmentData] = useState<IAttachment | any>(null);

  const [mutateUpdateProfile, responseUpdateProfile] =
    useMutation(updateProfileAPI);

  const onFinish = async (values) => {
    const payload = { ...values, attachmentId, userId: id };
    try {
      await mutateUpdateProfile(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            'Updated Successfully'
          );
          queryCache.invalidateQueries(`loggedInUser`);
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const { data } = useQuery([`loggedInUser`, id], getUserAPI, {
    enabled: id,
  });

  useEffect(() => {
    if (data && data.data) {
      const { profile } = data.data.result;
      form.setFieldsValue({ ...profile, prefix: parseInt(profile?.prefix) });
      setAttachmentData(profile.attachment);
    }
  }, [data, form]);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 100 }}
        showSearch
        defaultValue={92}
        filterOption={(input, option) => {
          return (
            option?.id?.toLowerCase().includes(input?.toLocaleLowerCase()) ||
            option?.title?.toLowerCase().includes(input?.toLocaleLowerCase())
          );
        }}
      >
        {phoneCodes?.map((country) => {
          return (
            <Option
              value={country?.phoneCode}
              title={`${country?.phoneCode}`}
              id={country?.short}
            >
              <img
                className="mr-10"
                alt="flag"
                style={{ width: 18, height: 18, verticalAlign: 'sub' }}
                src={getFlag(country.short)}
              />
              <span>+{country?.phoneCode}</span>
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

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
                  rules={[{ required: true, message: 'Full Name' }]}
                >
                  <Input placeholder={'Your full name'} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Job Title</FormLabel>
                <Form.Item
                  name="jobTitle"
                  rules={[{ required: false, message: 'Your job title' }]}
                >
                  <Input placeholder={''} size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Brief Bio</FormLabel>
                <Form.Item name="bio">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Country</FormLabel>
                <Form.Item
                  name="country"
                  rules={[{ required: true }]}
                >
                  <Select
                    size="middle"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select a Country"
                    filterOption={(input, option) => {
                      return option?.title
                        ?.toLowerCase()
                        .includes(input?.toLocaleLowerCase());
                    }}
                  >
                    {en?.map((country) => {
                      return (
                        <Option title={country?.name} value={country?.id}>
                          <img
                            className="mr-10"
                            alt="flag"
                            style={{
                              width: 18,
                              height: 18,
                              verticalAlign: 'sub',
                            }}
                            src={getFlag(country.alpha2)}
                          />
                          <span>{country?.name}</span>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Heading type="form-inner">Contact Details</Heading>
                <br />
              </Col>

              <Col span={12}>
                <FormLabel>Phone Number</FormLabel>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: false,
                      message: 'Please add your last name',
                    },
                    { max: 12, min: 4 },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    type="text"
                    placeholder="3188889898"
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Website</FormLabel>
                <Form.Item name="website">
                  <Input
                    placeholder={'eg: http://www.example.com'}
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
