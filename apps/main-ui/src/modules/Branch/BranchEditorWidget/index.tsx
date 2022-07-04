import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import React, { FC, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { getBranchByIdAPI } from '../../../api';
import { addBrnachAPI } from '../../../api/organizations';
import { CommonModal } from '../../../components';
import { FormLabel } from '../../../components/FormLabel';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../../hooks/globalContext/globalManager';
import { NOTIFICATIONTYPE } from '../../../modal';
import { updateToken } from '../../../utils/http';
import phoneCodes from '../../../utils/phoneCodes';
import { BOLDTEXT } from '../../../components/Para/BoldText';
import { Seprator } from '../../../components/Seprator';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

export const BranchEditorWidget: FC = () => {
  const queryCache = useQueryClient();
  const {
    branchModalConfig,
    setBranchModalConfig,
    notificationCallback,
    setUserDetails,
    handleLogin,
  } = useGlobalContext();
  const {
    mutate: mutateAddBranch,
    isLoading: addingBranch,
    data: responseAddingBranch,
  } = useMutation(addBrnachAPI);
  const [form] = Form.useForm();

  const { branchId, id } = branchModalConfig;

  const { data } = useQuery(
    [`branch-${branchId}`, branchId],
    getBranchByIdAPI,
    {
      enabled: !!branchId,
    }
  );

  useEffect(() => {
    form.setFieldsValue({ prefix: 92 });
  }, []);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      const { city, postalCode, description } = result?.address;
      form.setFieldsValue({
        ...result,
        prefix: parseInt(result?.prefix),
        city,
        postalCode,
        address: description,
      });
    }
  }, [data, form]);

  const onFinish = async (values) => {
    const { city, address, postalCode, country } = values;

    const _address = {
      city,
      postalCode,
      country,
      description: address,
    };

    let restValues = {};

    Object.keys(values).forEach((key) => {
      if (!Object.keys(_address).includes(key)) {
        restValues = { ...restValues, [key]: values[key] };
      }
    });

    let payload: any = {
      ...restValues,
      address: _address,
      organizationId: id,
      isNewRecord: true,
    };

    if (branchId !== null) {
      payload = { ...payload, isNewRecord: false, id: branchId };
    }
    await mutateAddBranch(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          `Branch ${branchId ? `Updated` : `Created`} Successfully`
        );
        form.resetFields();
        queryCache.invalidateQueries(`all-organizations`);
        setBranchModalConfig(false);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    if (responseAddingBranch?.data?.result?.access_token) {
      const { result } = responseAddingBranch.data;
      const { access_token, users } = result;

      updateToken(access_token);
      setUserDetails(users);
      handleLogin({ type: ILoginActions.LOGIN, payload: result });
    }
  }, [responseAddingBranch, handleLogin, setUserDetails]);

  const onFinishFailed = (error) => {
    console.log(error, 'error');
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
        {phoneCodes?.map((country, index) => {
          return (
            <Option
              key={index}
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
    <CommonModal
      visible={branchModalConfig.visibility}
      onCancel={() => setBranchModalConfig(false)}
      title={'Add Branch'}
      footer={false}
      width={846}
    >
      <WrapperBranchEditor>
        <Form
          layout={'vertical'}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Name of Branch?"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Name is Required !',
                  },
                ]}
              >
                <Input placeholder="eg. ABC Store" size="middle" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: false,
                    message: 'Branchh Email is Required !',
                  },
                  {
                    type: 'email',
                  },
                ]}
              >
                <Input placeholder="abc@yourcompany.com" size="middle" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Fax No" name="faxNumber">
                <Input placeholder="Enter your fax number" size="middle" />
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
            <Col span={24}>
              <h3>
                <BOLDTEXT>Address Details</BOLDTEXT>
              </h3>
              <Seprator />
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
            <Col span={24}>
              <Form.Item name="address" label="Address Description">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="isMain" valuePropName="checked">
                <Checkbox>Is main branch</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <div className="textRight mt-10">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setBranchModalConfig(false);
                    }}
                    className="mr-10"
                    type="default"
                  >
                    {' '}
                    Cancel
                  </Button>
                  <Button
                    loading={addingBranch}
                    type="primary"
                    htmlType="submit"
                  >
                    Create
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </WrapperBranchEditor>
    </CommonModal>
  );
};
export default BranchEditorWidget;
const WrapperBranchEditor: any = styled.div`
  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -22px;
  }

  .ant-form-item {
    margin-bottom: 13px;
  }
`;
