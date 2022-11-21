import { Button, Col, Form, Input, Row, Select } from 'antd';
import { getFlag } from '../../../../utils/getFlags';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { updateProfileAPI, updateUserProfileAPI } from '../../../../api';
import {
  FormLabel,
  Heading,
  Para,
  Seprator,
  UploadAtachment,
} from '@components';

import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { IAttachment, NOTIFICATIONTYPE } from '@invyce/shared/types';
import convertToRem from '../../../../utils/convertToRem';
import phoneCodes from '../../../../utils/phoneCodes';
import en from '../../../../../../../node_modules/world_countries_lists/data/en/world.json';
import { isNumber } from '../../../../utils/helperFunctions';

const { Option } = Select;

interface IProps {
  id?: number;
}

const { TextArea } = Input;

export const ProfileForm: FC<IProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [attachmentId, setAttachmentId] = useState<number>(null);
  const { notificationCallback, refetchUser, userDetails } = useGlobalContext();
  const [attachmentData, setAttachmentData] = useState<IAttachment | any>(null);

  const { mutate: mutateUpdateProfile, isLoading: updatingProfile } =
    useMutation(updateUserProfileAPI);

  const onFinish = async (values) => {
    const payload = { ...values, attachmentId, userId: id };
    await mutateUpdateProfile(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Updated Successfully');
        refetchUser();
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (userDetails?.profile) {
      const { profile } = userDetails;
      form.setFieldsValue({ ...profile, prefix: parseInt(profile?.prefix) });
      setAttachmentData(profile.attachment);
    }
  }, [userDetails, form]);

  const prefixSelector = (
    // <Form.Item name="prefix" noStyle>
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
            key={country?.phoneCode}
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
    // </Form.Item>
  );

  return (
    <WrapperProfileForm>
      <Form form={form} onFinishFailed={onFinishFailed}>
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
                  <Input
                    placeholder={'Your full name'}
                    size="large"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Job Title</FormLabel>
                <Form.Item
                  name="jobTitle"
                  rules={[{ required: false, message: 'Your job title' }]}
                >
                  <Input placeholder={''} size="large" autoComplete="off" />
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
                <Form.Item name="country" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select a Country"
                    filterOption={(input, option) => {
                      return option?.title
                        ?.toLowerCase()
                        .includes(input?.toLocaleLowerCase());
                    }}
                  >
                    {en?.map((country, index) => {
                      return (
                        <Option
                          title={country?.name}
                          value={`${country?.name}`}
                          key={index}
                        >
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
                    autoComplete="off"
                    addonBefore={prefixSelector}
                    type="text"
                    placeholder="3188889898"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel>Website</FormLabel>
                <Form.Item name="website">
                  <Input
                    placeholder={'eg: http://www.example.com'}
                    size="large"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
              <Seprator />
              <Col span={24}>
                <Form.Item>
                  <div className="actions-wrapper">
                    <Button
                      loading={updatingProfile}
                      type="primary"
                      // htmlType="submit"
                      onClick={() => {
                        const values = form?.getFieldsValue();
                        onFinish(values);
                      }}
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
