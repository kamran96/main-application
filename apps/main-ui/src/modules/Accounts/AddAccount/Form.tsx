import { Button, Col, Form, Input, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { FC, useEffect, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import {
  createUpdateAccountAPI,
  getAccountByIDAPI,
  getAccountCodeAPI,
  getSecondaryAccounts,
} from '../../../api/accounts';
import { CommonModal } from '../../../components';
import { FormLabel } from '../../../components/FormLabel';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../../modal';
import convertToRem from '../../../utils/convertToRem';
import getRangeOfNumbers from '../../../utils/getRangeOfNumbers';
import { ISecondaryAccount } from './../../../modal/accounts';

const { Option } = Select;
export const AccountsForm: FC = () => {
  const queryCache = useQueryClient();
  const { mutate: mutateAddAccount, isLoading: creatingAccount } = useMutation(
    createUpdateAccountAPI
  );

  const { mutate: mutateGetAccountCode } = useMutation(getAccountCodeAPI);

  const [secondaryAccounts, setSecondaryAccounts] = useState<
    ISecondaryAccount[]
  >([]);

  const { accountsModalConfig, setAccountsModalConfig, notificationCallback } =
    useGlobalContext();
  const { id } = accountsModalConfig;
  const [form] = Form.useForm();

  const resAccountById = useQuery([`account-${id}`, id], getAccountByIDAPI, {
    enabled: !!id,
    onSuccess: () => {
      /* when successfully created OR updated toast will be apear */
      /* three type of parameters are passed
        first: notification type
        second: message title
        third: message description
        */
      notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Account Fetched');
    },
  });

  useEffect(() => {
    const { data } = resAccountById;
    if (data && data.data && data.data.result) {
      const { name, code, description, secondaryAccount, taxRate } =
        data.data.result;
      const formData = {
        name,
        code,
        description,
        secondaryAccountId: secondaryAccount.id,
        taxRate,
      };

      form.setFieldsValue(formData);
    }
  }, [resAccountById.data, form, resAccountById]);

  const onFinishForm = async (values) => {
    try {
      let payload = { ...values, isNewRecord: true };

      if (id) {
        payload = { ...payload, id, isNewRecord: false };
      }

      await mutateAddAccount(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            id ? 'Updated' : 'Created'
          );
          ['accounts', `account-${id}`]?.forEach((key) => {
            (queryCache?.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          setAccountsModalConfig({ visibility: false, id: null });
          form.resetFields();
        },
      });
    } catch (error) {
      console.log({ error });
    }
  };
  const onFinisFailed = (error) => {
    console.log(error, 'check error');
  };

  /*Query hook for  Fetching single contact against ID */
  const { isLoading, data } = useQuery(
    [`secondary-accounts`],
    getSecondaryAccounts,
    {
      enabled: accountsModalConfig.visibility === true,
    }
  );

  useEffect(() => {
    if (data && data.data) {
      setSecondaryAccounts(data.data.result);
    }
  }, [data]);

  return (
    <CommonModal
      width={580}
      title="Add New Account"
      okButtonProps={{ loading: false }}
      footer={false}
      visible={accountsModalConfig.visibility}
      onCancel={() => setAccountsModalConfig({ visibility: false, id: null })}
    >
      <WrapperAddAccount>
        <Form
          onFinish={onFinishForm}
          onFinishFailed={onFinisFailed}
          form={form}
        >
          <Row gutter={24}>
            <Col span={12}>
              <FormLabel>Account Type</FormLabel>
              <Form.Item
                name="secondaryAccountId"
                rules={[{ required: true, message: 'Please account' }]}
                getValueFromEvent={(value) => {
                  if (!id) {
                    mutateGetAccountCode(
                      { id: value },
                      {
                        onSuccess: (data) => {
                          form.setFieldsValue({
                            code: data?.data?.result?.code,
                          });
                        },
                      }
                    );
                  }
                  return value;
                }}
              >
                <Select
                  loading={isLoading}
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select account"
                  optionFilterProp="children"
                >
                  {secondaryAccounts.length > 0 &&
                    secondaryAccounts.map((acc: ISecondaryAccount, index) => {
                      return (
                        <Option key={acc.name} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <p className="input-info">
                Select Account type for new account head
              </p>
            </Col>
            <Col span={12}>
              <FormLabel>Name</FormLabel>
              <Form.Item name="name">
                <Input size="large" />
              </Form.Item>
              <p className="input-info">
                A short title for this account (limited to 150 characters)
              </p>
            </Col>
            <Col span={12}>
              <FormLabel>Code</FormLabel>
              <Form.Item name="code">
                <Input size="large" type="number" disabled />
              </Form.Item>
              <p className="input-info">
                A unique code/number for this account (limited to 10 characters)
              </p>
            </Col>
            <Col span={12}>
              <FormLabel>Tax</FormLabel>
              <Form.Item name="taxRate">
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select tax.."
                  optionFilterProp="children"
                >
                  {getRangeOfNumbers(0, 100).map((tax, index) => {
                    return (
                      <Option key={index} value={tax}>
                        {tax}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <p className="input-info">
                The default tax setting for this account
              </p>
            </Col>
            <Col span={24}>
              <FormLabel>Description (Optional)</FormLabel>
              <Form.Item name="description">
                <TextArea rows={5} />
              </Form.Item>
              <p className="input-info">
                A description of how this account should be used
              </p>
            </Col>
            <Col span={24}>
              <Form.Item>
                <div className="action_buttons">
                  <Button
                    loading={creatingAccount}
                    type="primary"
                    htmlType="submit"
                  >
                    {accountsModalConfig.id ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setAccountsModalConfig({ visibility: false, id: null });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </WrapperAddAccount>
    </CommonModal>
  );
};

const WrapperAddAccount = styled.div`
  .input-info {
    font-style: normal;
    font-weight: normal;
    font-size: 0.875rem;
    padding-left: 0.1875rem;
    color: #828282;
    margin: ${convertToRem(6)} 0 ${convertToRem(20)} 0;
  }

  .ant-form-item {
    margin-bottom: ${convertToRem(1)};
  }

  .action_buttons {
    text-align: right;
    button {
      margin: 0 ${convertToRem(10)};
    }
  }
`;
