import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Row, Col, Input, Button, Select, InputNumber } from 'antd';
import { FormLabel } from './../../../components/FormLabel/index';
import { Heading } from '../../../components/Heading';
import { Para } from './../../../components/Para/index';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { create_update_contact, viewSingleContact } from '../../../api/Contact';
import {
  IContactTypes,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
} from '../../../modal';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { AddressForm } from './addressForm';
import { getAllAccounts } from '../../../api/accounts';
import { IAccountsResult } from '../../../modal/accounts';
import { EnterpriseWrapper } from '../../../components/EnterpriseWrapper';
import { IOrganizationType } from '../../../modal/organization';
import Checkbox from 'antd/lib/checkbox/Checkbox';

const { Option } = Select;

interface IProps {
  id?: any;
}

export const ContactsForm: FC<IProps> = ({ id }) => {
  /* HOOKS */

  /* user context API hook*/
  const { notificationCallback } = useGlobalContext();
  const [hasOpeningBalance, setHasOpeningBalance] = useState(false);
  const [showOpeningBlance, setShowOpeningBalance] = useState(false);
  const [address, setAddress] = useState([
    {
      description: '',
      addressType: 1,
      city: '',
      town: '',
      country: '',
      postalCode: '',
    },
    {
      description: '',
      addressType: 2,
      city: '',
      town: '',
      country: '',
      postalCode: '',
    },
  ]);
  /* Use form hook antd */
  const [form] = Form.useForm();
  const queryCache = useQueryClient();

  const { data: AllAccounts } = useQuery(
    [`all-accounts`, 'ALL'],
    getAllAccounts
  );

  const debitedAccounts: IAccountsResult[] =
    (AllAccounts &&
      AllAccounts.data &&
      AllAccounts.data.result &&
      AllAccounts.data.result.filter(
        (acc) => acc?.secondary_account?.primary_account?.name === 'assets'
      )) ||
    [];
  const creditedAccounts: IAccountsResult[] =
    (AllAccounts &&
      AllAccounts.data &&
      AllAccounts.data.result &&
      AllAccounts.data.result.filter(
        (acc) =>
          acc?.secondary_account?.primary_account?.name === 'liability' ||
          acc?.secondary_account?.primary_account?.name === 'equity'
      )) ||
    [];

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  /* Mutation to create and update contact */
  const {
    mutate: mutateAddContact,
    isSuccess,
    isLoading,
  } = useMutation(create_update_contact);

  /*Query hook for  Fetching single contact against ID */
  const { data } = useQuery([`contact-${id}`, id], viewSingleContact, {
    enabled: id,
    onSuccess: () => {
      /* when successfully created OR updated toast will be apear */
      /* three type of parameters are passed
        first: notification type
        second: message title
        third: message description
        */
      notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Contact Fetched');
    },
  });

  /* Component did update hook to update form values when contact
   against ID is successfull fetches */
  useEffect(() => {
    if (id && data && data.data.result) {
      const { result } = data.data;
      const { addresses } = result;

      form.setFieldsValue({
        ...result,
      });
      if (addresses.length) {
        setAddress(addresses);
      }
    }
  }, [data, id, form]);

  /* HOOKS ENDS HERE */

  /* Async function to create and update a contact */
  const onFinish = async (values) => {
    let payload = {
      ...values,
      isNewRecord: true,
      addresses: address,
    };
    if (id) {
      payload = {
        ...payload,
        isNewRecord: false,
        id: id,
      };
    }

    await mutateAddContact(payload, {
      onSuccess: () => {
        [`contacts-list`, `all-contacts`, `transactions`].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) => q.startsWith(key));
        });
        if (id) {
          [
            `contacts-list`,
            `all-contacts`,
            `contact-${id}`,
            `transactions`,
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q.startsWith(key));
          });
        }
        /* when successfully created OR updated toast will be apear */
        /* three type of parameters are passed
        first: notification type
        second: message title
        third: message description
        */
        form.resetFields();
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          id ? 'Updated Successfully' : 'Created Successfully'
        );
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <WrapperContactsForm>
      <Form
        form={form}
        onValuesChange={(changedValue, values) => {
          if (
            changedValue?.openingBalance &&
            changedValue?.openingBalance !== '0'
          ) {
            setHasOpeningBalance(true);
          } else if (changedValue?.openingBalance) {
            if (hasOpeningBalance) {
              setHasOpeningBalance(false);
            }
          }
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={24} offset={0}>
            <div className="pv-30">
              <Heading type="form-inner">Personal Information</Heading>
              <Para type="heading-description">
                Please input details of your Potential Customers
              </Para>
            </div>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Contact Type</FormLabel>
            <Form.Item
              name="contactType"
              rules={[{ required: true, message: 'Select Contact Type' }]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Item"
                optionFilterProp="children"
              >
                <Option value={IContactTypes.CUSTOMER}>Customer</Option>
                <Option value={IContactTypes.SUPPLIER}>Supplier</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Company Name</FormLabel>
            <Form.Item
              name="businessName"
              rules={[
                { required: true, message: 'Please provide Company Name' },
              ]}
            >
              <Input placeholder={''} size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <FormLabel isRequired={true}>Email</FormLabel>
            <Form.Item
              name="email"
              rules={[
                {
                  required: false,
                  message: 'Please provide Email',
                  type: 'email',
                },
              ]}
            >
              <Input placeholder={'john@example.com'} size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Primary Person</FormLabel>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please Primay Person',
                },
              ]}
            >
              <Input placeholder={'john@example.com'} size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={false}>Phone Number</FormLabel>
            <Form.Item
              shouldUpdate
              name="phoneNumber"
              rules={[
                {
                  message: 'Please provide Phone Number',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder={'(Area code + Alot number). eg : 05811-45XXXX'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Mobile Number</FormLabel>
            <Form.Item
              name="cellNumber"
              rules={[
                {
                  max: 11,
                  min: 11,
                  message: 'Mobile Number must be in 11 Characters',
                },
                { required: true, message: 'Phone Number is required!' },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder={'0310XXXXXXX'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={false}>Fax Number</FormLabel>
            <Form.Item
              name="faxNumber"
              rules={[
                {
                  required: false,
                  message: 'Please provide Fax Number',
                },
                {
                  max: 10,
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder={'0215XXXX'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={false}>Skype Name / Number</FormLabel>
            <Form.Item
              name="skypeName"
              rules={[{ required: false, message: 'Please provide Skype ID' }]}
            >
              <Input placeholder={'live:@example'} size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={false}>Website</FormLabel>
            <Form.Item
              name="webLink"
              rules={[
                {
                  required: false,
                  message: 'Please provide website',
                  type: 'url',
                },
              ]}
            >
              <Input
                placeholder={'http://www.phunar.example.com'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>CNIC</FormLabel>
            <Form.Item
              name="cnic"
              rules={[
                {
                  max: 13,
                  min: 13,
                  message: 'Cnic must be in 13 Characters',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                size="large"
                placeholder={'Your CNIC without (-) eg: 7150112547851'}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="textRight">
              <Button
                onClick={() => {
                  const addresses = [...address];
                  const indexed = addresses.findIndex(
                    (adress) => adress.addressType === 1
                  );
                  if (indexed > -1) {
                    const { description, city, country, postalCode } =
                      address[indexed];
                    const secondaryIndex = addresses.findIndex(
                      (adress) => adress.addressType === 2
                    );
                    if (secondaryIndex > -1) {
                      addresses[secondaryIndex] = {
                        ...addresses[secondaryIndex],
                        description,
                        city,
                        country,
                        postalCode,
                      };
                      setAddress(addresses);
                    } else {
                      addresses.push({ ...addresses[indexed], addressType: 2 });
                      setAddress(addresses);
                    }
                  } else {
                    notificationCallback(
                      NOTIFICATIONTYPE.ERROR,
                      "Postal Address isn't provided"
                    );
                  }
                }}
                type="link"
                size="middle"
              >
                Same as postal address
              </Button>
            </div>
          </Col>
          {address.map((adr, index) => {
            return (
              <Col span={12}>
                <AddressForm
                  reset={isSuccess}
                  index={index}
                  item={adr}
                  onChange={(values) => {
                    const payload = { ...values, addressType: adr.addressType };
                    const addressArr = [...address];
                    const indexed = addressArr.findIndex(
                      (ind) => ind && ind.addressType === adr.addressType
                    );
                    if (indexed > -1) {
                      addressArr[indexed] = {
                        ...addressArr[indexed],
                        ...payload,
                      };
                      setAddress(addressArr);
                    } else {
                      addressArr.push(payload);
                      setAddress(addressArr);
                    }
                  }}
                  state={address}
                />
              </Col>
            );
          })}
        </Row>
        <Row gutter={24}>
          <Col span={24} offset={0}>
            <div className="pv-30">
              <Heading type="form-inner">Financial Details</Heading>
              <Para type="heading-description">
                All defaults can be overridden on individual transactions
              </Para>
            </div>
          </Col>
          <Col span={24}>
            <div className="pb-10">
              <Checkbox
                checked={showOpeningBlance}
                onChange={(e) => setShowOpeningBalance(e.target.checked)}
              >
                Enable Opening Balance
              </Checkbox>
            </div>
          </Col>
          {!id && showOpeningBlance && (
            <Col span={12}>
              <FormLabel isRequired={false}>Opening Balance</FormLabel>
              <Form.Item
                name="openingBalance"
                rules={[{ required: false, message: 'Opening Balance' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder={''}
                  size="large"
                />
              </Form.Item>
            </Col>
          )}
          <EnterpriseWrapper enable={[IOrganizationType.ENTERPRISE]}>
            <Col span={12}>
              <FormLabel isRequired={false}>Debit Account</FormLabel>
              <Form.Item
                name="debitAccount"
                rules={[{ required: false, message: 'Debit Account' }]}
              >
                <Select
                  disabled={!hasOpeningBalance}
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                >
                  {debitedAccounts.length &&
                    debitedAccounts.map((acc: IAccountsResult, index) => {
                      return (
                        <Option key={index} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </EnterpriseWrapper>
          <EnterpriseWrapper enable={[IOrganizationType.ENTERPRISE]}>
            <Col span={12}>
              <FormLabel isRequired={false}>Credit Account</FormLabel>
              <Form.Item
                name="creditAccount"
                rules={[{ required: false, message: 'Credit Account' }]}
              >
                <Select
                  disabled={!hasOpeningBalance}
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select Item"
                  optionFilterProp="children"
                >
                  {creditedAccounts.length &&
                    creditedAccounts.map((acc: IAccountsResult, index) => {
                      return (
                        <Option key={index} value={acc.id}>
                          {acc.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </EnterpriseWrapper>
          <Col span={12}>
            <FormLabel isRequired={true}>Credit Limit Amount</FormLabel>
            <Form.Item
              name="creditLimit"
              rules={[{ required: true, message: 'Please add Credit Limit' }]}
            >
              <InputNumber
                type="number"
                style={{ width: '100%' }}
                placeholder={''}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Credit Limit Block </FormLabel>
            <Form.Item
              name="creditLimitBlock"
              rules={[
                {
                  required: true,
                  message: 'Please credit block limit',
                  type: 'number',
                },
              ]}
            >
              <InputNumber
                type="number"
                style={{ width: '100%' }}
                placeholder={'add credit limit block'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Credit Discount % </FormLabel>
            <Form.Item
              name="salesDiscount"
              rules={[
                { required: true, message: 'If no any discount please type 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                type="number"
                placeholder={'Sales discount in percentage or amount'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Payment Days Limit</FormLabel>
            <Form.Item
              name="paymentDaysLimit"
              rules={[
                {
                  required: true,
                  message: 'Please provide payment days limit',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder={'Please add payment days limit'}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Account Number</FormLabel>
            <Form.Item
              name="accountNumber"
              rules={[
                {
                  required: false,
                  message: 'Please provide Account Number',
                },
              ]}
            >
              <Input style={{ width: '100%' }} placeholder={''} size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} offset={12}>
            <Form.Item>
              <div className="actions-wrapper">
                <Button
                  onClick={() => {
                    form.resetFields();
                    history.push(`/app${ISupportedRoutes.CONTACTS}`);
                  }}
                  type="default"
                >
                  Cancel
                </Button>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  {id ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </WrapperContactsForm>
  );
};

const WrapperContactsForm: React.ReactElement<any> | any = styled.div`
  .actions-wrapper {
    display: flex;
    justify-content: flex-end;

    button {
      margin: 0 5px;
    }
  }
`;
