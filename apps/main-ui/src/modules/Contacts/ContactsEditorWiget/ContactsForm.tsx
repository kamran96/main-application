import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Row, Col, Input, Button, Select, InputNumber } from 'antd';
import { FormLabel, Heading, Para, EnterpriseWrapper } from '@components';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  create_update_contact,
  viewSingleContact,
  getAllAccounts,
  getBankAccounts,
} from '../../../api';
import {
  IContactTypes,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  IAccountsResult,
  IOrganizationType,
} from '@invyce/shared/types';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { AddressForm } from './addressForm';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useLocation } from 'react-router-dom';
import en from 'world_countries_lists/data/en/world.json';
import phoneCodes from '../../../utils/phoneCodes';

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

  const location = useLocation();

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
        (acc) => acc?.secondaryAccount?.primaryAccount?.name === 'asset'
      )) ||
    [];
  const creditedAccounts: IAccountsResult[] =
    (AllAccounts &&
      AllAccounts.data &&
      AllAccounts.data.result &&
      AllAccounts.data.result.filter(
        (acc) =>
          acc?.secondaryAccount?.primaryAccount?.name === 'liability' ||
          acc?.secondaryAccount?.primaryAccount?.name === 'equity' ||
          acc?.secondaryAccount?.primaryAccount?.name === 'revenue'
      )) ||
    [];

  useEffect(() => {
    if (location?.state && location?.state !== undefined) {
      if (location?.state === 'customers') {
        form.setFieldsValue({ contactType: IContactTypes.CUSTOMER });
      } else if (location?.state === 'suppliers') {
        form.setFieldsValue({ contactType: IContactTypes.SUPPLIER });
      }
    }
  }, [location?.state]);

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
    enabled: !!id,
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
    if (id && data && data?.data?.result) {
      const { result } = data?.data;
      const { addresses } = result;

      form.setFieldsValue({
        ...result,
      });
      if (addresses?.length === 1) {
        setAddress((prev) => {
          prev.splice(0, 1, { ...addresses[0] });
          return prev;
        });
      } else if (addresses.length) {
        setAddress(addresses);
      }
    }
  }, [data, id, form]);

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
        defaultValue={`92`}
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
              id={`${country?.short}`}
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
        history.push({
          pathname: `/app${ISupportedRoutes?.CONTACTS}`,
          state: {
            from: history.location.pathname,
          },
        });
      },
    });
  };

  const { data: allBanks } = useQuery([`bank-accounts`], getBankAccounts);

  const banksList = allBanks?.data?.result || [];

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const banksAddOn = (
    <Form.Item name="bankId">
      <Select
        loading={isLoading}
        // size="large"
        showSearch
        // style={{ width: '100%' }}
        placeholder="Select Bank"
        optionFilterProp="children"
      >
        {banksList.map((bank, index) => {
          return (
            <Option key={index} value={bank.accountId}>
              {bank.name}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

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
                {
                  pattern: /^\S/,
                  message: 'Please remove Whitespaces and provide Company Name',
                },
              ]}
            >
              <Input placeholder={''} autoComplete="off" size="large" />
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
              <Input
                placeholder={'john@example.com'}
                autoComplete="off"
                size="large"
              />
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
                {
                  pattern: /^\S/,
                  message: 'Please Primay Person',
                },
              ]}
            >
              <Input
                placeholder={'john@example.com'}
                autoComplete="off"
                size="large"
              />
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
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Mobile Number</FormLabel>
            <Form.Item
              name="cellNumber"
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
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={false}>Skype Name / Number</FormLabel>
            <Form.Item
              name="skypeName"
              rules={[{ required: false, message: 'Please provide Skype ID' }]}
            >
              <Input
                autoComplete="off"
                placeholder={'live:@example'}
                size="large"
              />
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
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel isRequired={true}>Country</FormLabel>
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
                {en?.map((country) => {
                  return (
                    <Option title={country?.name} value={country?.name}>
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
          {!data?.data?.result?.hasOpeningBalance && (
            <>
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
              {showOpeningBlance && (
                <Col span={12}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <FormLabel isRequired={false}>Opening Balance</FormLabel>
                      <Form.Item
                        name="openingBalance"
                        rules={[
                          { required: false, message: 'Opening Balance' },
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          placeholder={''}
                          size="large"
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <EnterpriseWrapper enable={[IOrganizationType.SAAS]}>
                      <Col span={12}>
                        <FormLabel isRequired={false}>Debit Account</FormLabel>
                        <Form.Item
                          name="debitAccount"
                          rules={[
                            { required: false, message: 'Debit Account' },
                          ]}
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
                              debitedAccounts.map(
                                (acc: IAccountsResult, index) => {
                                  return (
                                    <Option key={index} value={acc.id}>
                                      {acc.name}
                                    </Option>
                                  );
                                }
                              )}
                          </Select>
                        </Form.Item>
                      </Col>
                    </EnterpriseWrapper>
                    <EnterpriseWrapper enable={[IOrganizationType.SAAS]}>
                      <Col span={12}>
                        <FormLabel isRequired={false}>Credit Account</FormLabel>
                        <Form.Item
                          name="creditAccount"
                          rules={[
                            { required: false, message: 'Credit Account' },
                          ]}
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
                              creditedAccounts.map(
                                (acc: IAccountsResult, index) => {
                                  return (
                                    <Option key={index} value={acc.id}>
                                      {acc.name}
                                    </Option>
                                  );
                                }
                              )}
                          </Select>
                        </Form.Item>
                      </Col>
                    </EnterpriseWrapper>
                  </Row>
                </Col>
              )}
            </>
          )}

          <Col span={12}>
            <Row gutter={24}>
              <Col span={12}>
                <FormLabel isRequired={true}>Credit Limit Amount</FormLabel>
                <Form.Item
                  name="creditLimit"
                  rules={[
                    { required: true, message: 'Please add Credit Limit' },
                  ]}
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
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <FormLabel isRequired={true}>Credit Discount % </FormLabel>
                <Form.Item
                  name="salesDiscount"
                  rules={[
                    {
                      required: true,
                      message: 'If no any discount please type 0',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    type="number"
                    placeholder={'Sales discount in percentage or amount'}
                    size="large"
                    autoComplete="off"
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
                    {
                      pattern: /^\S/,
                      message: 'Please provide payment days limit',
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={'Please add payment days limit'}
                    size="large"
                    autoComplete="off"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={24}>
              <Col span={24}>
                <FormLabel isRequired={true}>Account Number</FormLabel>
                <Form.Item
                  name="accountNumber"
                  rules={[
                    {
                      required: false,
                      message: 'Please provide Account Number',
                    },
                    {
                      pattern: /^\S/,
                      message: 'Please provide Account Number',
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={''}
                    size="large"
                  />
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <FormLabel isRequired={true}>Select Bank</FormLabel>
                <Form.Item name="bankId">
                  <Select
                    loading={isLoading}
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Bank"
                    optionFilterProp="children"
                  >
                    {banksList.map((bank, index) => {
                      return (
                        <Option key={index} value={bank.accountId}>
                          {bank.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col> */}
            </Row>
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
