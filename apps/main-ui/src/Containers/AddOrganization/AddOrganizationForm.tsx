/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import en from 'world_countries_lists/data/en/world.json';

import {
  addOrganizationAPI,
  getOrganizationByIdAPI,
} from '../../api/organizations';
import { CommonModal } from '../../components';
import { DatePicker } from '../../components/DatePicker';
import { BOLDTEXT } from '../../components/Para/BoldText';
import { Seprator } from '../../components/Seprator';
import { UploadAtachment } from '../../components/UploadAtachment';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { NOTIFICATIONTYPE } from '../../modal';
import { IBaseAPIError, IServerError } from '../../modal/base';
import { updateToken } from '../../utils/http';
import phoneCodes from '../../utils/phoneCodes';

const { Option } = Select;

interface IProps {
  initialState?: any;
}

export const AddOrganizationForm: FC<IProps> = ({ initialState }) => {
  const queryCache = useQueryClient();
  const {
    mutate: mutateAddOrganization,
    isLoading,
    data: updateResponseData,
  } = useMutation(addOrganizationAPI);

  const [form] = Form.useForm();

  const {
    organizationModalConfig,
    setOrganizationConfig,
    notificationCallback,
    setUserDetails,
    handleLogin,
    refetchUser,
  } = useGlobalContext();
  const { id, visibility } = organizationModalConfig;

  const { data, error } = useQuery(
    [`organization-${id}`, id],
    getOrganizationByIdAPI,
    {
      enabled: !!id,
    }
  );
  const errorResponse: IBaseAPIError = error;

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      form.setFieldsValue({
        ...result,
        financialEnding: dayjs(result?.financialEnding),
        country: result?.address?.country,
        city: result?.address?.city,
        postalCode: result?.address?.postalCode,
      });
    } else if (
      errorResponse &&
      errorResponse.response &&
      errorResponse.response.data &&
      errorResponse.response.data.message
    ) {
      const { message } = errorResponse.response.data;
      notificationCallback(NOTIFICATIONTYPE.ERROR, message);
    }
  }, [data, error, errorResponse, notificationCallback, form]);

  const onFinish = async (values) => {
    let payload = { ...values, isNewRecord: true };
    if (id) {
      payload = { ...payload, isNewRecord: false, id };
    }
    await mutateAddOrganization(payload, {
      onSuccess: () => {
        form.resetFields();
        setOrganizationConfig(false);
        refetchUser();
        ['all-organizations']?.forEach((key) => {
          (queryCache?.invalidateQueries as any)((q) => q?.startsWith(key));
        });
        if (id) {
          queryCache.invalidateQueries(`organization-${id}`);
        }
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Created');
        handleClose();
      },
      onError: (error: IServerError) => {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            'Please check your internet connection'
          );
        }
      },
    });
  };

  useEffect(() => {
    if (updateResponseData?.data?.result?.access_token) {
      const { result } = updateResponseData.data;
      updateToken(result.access_token);
      setUserDetails(result.users);
      handleLogin({ type: ILoginActions.LOGIN, payload: result });
    }
  }, [updateResponseData, handleLogin, setUserDetails]);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleClose = () => {
    form.resetFields();
    setOrganizationConfig(false);
  };
  const getFlag = (short: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require(`world_countries_lists/flags/24x24/${short.toLowerCase()}.png`);
    // for dumi
    if (typeof data === 'string') {
      return data;
    }
    // for CRA
    return data.default;
  };
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
              value={`${country?.phoneCode}`}
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
    <CommonModal
      width={800}
      title="Add Your Organization"
      visible={visibility}
      onCancel={handleClose}
      cancelText={'Cancel'}
      okText={'Add Item'}
      okButtonProps={{ loading: false }}
      footer={false}
    >
      <WrapperAddOrganizationForm>
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name of Organization?"
                rules={[
                  { required: true, message: 'Organization Name is required!' },
                ]}
              >
                <Input size="middle" placeholder="e.g Abc pvt ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="niche"
                label="Organization Niche"
                rules={[{ required: true, message: 'Niche is required!' }]}
              >
                <Input size="middle" placeholder="e.g Abc pvt ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email?"
                rules={[{ required: true, message: 'Email is required!' }]}
              >
                <Input size="middle" placeholder="abce@domain.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="faxNumber"
                label="Fax No"
                rules={[{ required: false, message: 'Fax is required!' }]}
              >
                <Input size="middle" placeholder="Enter your fax number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: false, message: 'Please add your last name' },
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
              <Form.Item name="website" label="Website">
                <Input size="middle" placeholder="Website link" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Address Details</BOLDTEXT>
              </h3>
              <Seprator />
            </Col>
            <Col span={12}>
              <Form.Item
                name="country"
                rules={[{ required: true }]}
                label="Country"
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
                      <Option title={country?.name} value={`${country?.name}`}>
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

            <Col span={12}>
              <Form.Item name="city" label="City">
                <Input size="middle" placeholder="New York" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="postalCode" label="Area Code">
                <Input size="middle" placeholder="8898" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Financial details</BOLDTEXT>
              </h3>
              <Seprator />
            </Col>
            <Col span={12}>
              <Form.Item name="financialEnding" label="Financial Year Ends">
                <DatePicker
                  style={{ width: '100%' }}
                  size="middle"
                  picker={'month'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Organization Logo</BOLDTEXT>
              </h3>
              <Seprator />
            </Col>
            <Col span={12}>
              <Form.Item name="attachmentId">
                <UploadAtachment
                  onUploadSuccess={(id) => {
                    form.setFieldsValue({ attachmentId: id });
                  }}
                  defaultValue={data?.data?.result?.attachment}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item className="mt-20 textRight ">
                <Button
                  className="mr-10"
                  onClick={handleClose}
                  type="default"
                  size="middle"
                  htmlType="reset"
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  type="primary"
                  size="middle"
                  htmlType="submit"
                >
                  {' '}
                  &nbsp;&nbsp;{id ? 'Update' : 'Create'}{' '}
                  Organization&nbsp;&nbsp;
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </WrapperAddOrganizationForm>
    </CommonModal>
  );
};

export default AddOrganizationForm;

const WrapperAddOrganizationForm = styled.div`
  .actions_button {
    padding: 10px 0;
    text-align: right;
    button {
      margin: 0 10px;
    }
  }
`;
