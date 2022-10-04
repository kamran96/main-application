/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import bxPlus from '@iconify-icons/bx/bx-plus';
import Icon from '@iconify/react';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import {
  getAllContacts,
  getBankAccounts,
  getInvoiceAgainstID,
  paymentCreateAPI,
} from '../../../api';
import { DatePicker, FormLabel, CommonTable } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IContactType,
  IContactTypes,
  NOTIFICATIONTYPE,
  PaymentType,
  TRANSACTION_MODE,
  IInvoiceItem,
  IInvoiceResult,
  ReactQueryKeys,
} from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';
import Columns from './columns';

const { Option } = Select;

export const PaymentsForm: FC = () => {
  const queryCache = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<any>({
    runningPayment: false,
  });
  const [form] = Form.useForm();
  const [contact_id, setContactId] = useState(null);
  const [amountPaid, setAmountPaid] = useState<any>(0);
  const { mutate: mutatePayment, isLoading: paymentMutateLoading } =
    useMutation(paymentCreateAPI);
  const {
    notificationCallback,
    routeHistory,
    paymentsModalConfig,
    setPaymentsModalConfig,
  } = useGlobalContext();

  const { history } = routeHistory;

  const { contactId, type, orders } = paymentsModalConfig;

  useEffect(() => {
    if (history?.location?.search) {
      const type = history.location.search.split('=')[1];
      if (type === 'received') {
        setFormData({ ...formData, paymentMode: TRANSACTION_MODE.RECEIVABLES });
        form.setFieldsValue({ paymentMode: TRANSACTION_MODE.RECEIVABLES });
      } else {
        setFormData({ ...formData, paymentMode: TRANSACTION_MODE.PAYABLES });
        form.setFieldsValue({ paymentMode: TRANSACTION_MODE.PAYABLES });
      }
    } else if (history && history.location.pathname === '/app/payments') {
      setFormData({ ...formData, paymentMode: TRANSACTION_MODE.PAYABLES });
      form.setFieldsValue({ paymentMode: TRANSACTION_MODE.PAYABLES });
    }
  }, [history]);

  const [_invoiceData, _setInvoiceData] = useState<any[]>([
    {
      id: null,
      reference: '',
      issueDate: '',
      invoice_items: [],
      grossTotal: 0,
      netTotal: 0,
      discount: 0,
      balance: 0,
    },
  ]);

  useEffect(() => {
    form.setFieldsValue({ date: dayjs() });
  }, [form]);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  // useEffect(() => {

  //   if (type === 'receivable') {
  //     setFormData({
  //       ...formData,
  //       paymentMode: TRANSACTION_MODE.RECEIVABLES,
  //       contactId: contactId,
  //     });
  //     form.setFieldsValue({
  //       paymentMode: TRANSACTION_MODE.RECEIVABLES,
  //       contactId: contactId,
  //     });
  //     setContactId(contactId);
  //   } else {
  //     setFormData({
  //       ...formData,
  //       paymentMode: TRANSACTION_MODE.PAYABLES,
  //       contactId: contactId,
  //     });
  //     form.setFieldsValue({
  //       paymentMode: TRANSACTION_MODE.PAYABLES,
  //       contactId: contactId,
  //     });
  //   }
  // }, [paymentsModalConfig?.contactId]);

  useEffect(() => {
    if (type && contactId && orders) {
      form.setFieldsValue({
        paymentMode:
          type === 'payable'
            ? TRANSACTION_MODE.PAYABLES
            : TRANSACTION_MODE.RECEIVABLES,
        contactId: contactId,
      });
      setFormData(() => {
        setContactId(contactId);
        return {
          ...formData,
          paymentMode:
            type === 'payable'
              ? TRANSACTION_MODE.PAYABLES
              : TRANSACTION_MODE.RECEIVABLES,
          contactId: contactId,
        };
      });
    }
  }, [type, contactId, orders]);

  const { balance } = (_invoiceData.length &&
    _invoiceData.reduce((a, b) => {
      return { balance: a.balance + b.balance };
    })) || { balance: 0 };

  const paid = amountPaid ? amountPaid : 0;

  const remainingTotal = Math.abs(balance) - paid;

  const onFinish = async (values) => {
    // return false;
    const paid_invyces = _invoiceData.map(
      (invyce: IInvoiceItem, index: number) => {
        return invyce.id;
      }
    );

    let payload = {
      ...values,
      // reminingAmount,
    };

    if (!values.runningPayment) {
      payload = {
        ...payload,
        invoice_ids: [...paid_invyces],
      };
    }

    try {
      await mutatePayment(payload, {
        onSuccess: () => {
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Payment Created');
          [
            'all-credit-invoices',
            ReactQueryKeys.PAYMENTS_KEYS,
            ReactQueryKeys?.INVOICES_KEYS,
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) =>
              q?.startsWith(`${key}`)
            );
          });
          form.resetFields();

          _setInvoiceData([
            {
              id: null,
              reference: '',
              issueDate: '',
              invoice_items: [],
              grossTotal: 0,
              netTotal: 0,
              discount: 0,
              balance: 0,
            },
          ]);
          setAmountPaid(0);
          setPaymentsModalConfig(false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (error) => {
    console.log(error, 'error');
  };

  const { isLoading, data } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts,
    {
      enabled: paymentsModalConfig.visibility,
    }
  );
  const paymentModeSelected = formData && formData.paymentMode;
  const paymentTypeSelected = formData && formData.paymentType;
  const { data: _contactInvoices } = useQuery(
    [
      `all-credit-invoices-${contact_id}-${paymentModeSelected}`,
      { id: contact_id, paymentMode: paymentModeSelected },
    ],
    getInvoiceAgainstID,
    {
      enabled: !!contact_id && !!paymentModeSelected,
    }
  );

  useEffect(() => {
    if (orders?.length && type && _contactInvoices?.data?.result) {
      const { result } = _contactInvoices.data;
      const filtered = result?.filter((invoice) => invoice.id === orders[0]);

      _setInvoiceData(filtered);
    }
  }, [_contactInvoices, type, orders]);

  const contactInvoices: IInvoiceResult[] =
    _contactInvoices?.data?.result || [];

  const { data: allBanks } = useQuery([`bank-accounts`], getBankAccounts);

  const banksList = allBanks?.data?.result || [];

  const contactType =
    paymentModeSelected === TRANSACTION_MODE.PAYABLES
      ? IContactTypes.SUPPLIER
      : IContactTypes.CUSTOMER;

  const getContactAgaintPaymentType = () => {
    let contacts = [];
    if (data && data.data && data.data.result) {
      const resContacts: IContactType[] = data.data.result;
      const filtered = resContacts.filter(
        (item) => item.contactType === contactType
      );

      contacts = filtered;
    }
    return contacts;
  };

  // console.log(getContactAgaintPaymentType(), 'getContactAgaintPaymentType');

  const getCustomerBalance = () => {
    const filtered = getContactAgaintPaymentType().filter(
      (item) => item.id === contact_id
    );

    return filtered;
  };

  // console.log(getCustomerBalance(), 'getCustomerBalance');

  const handleChangedValue = (changedValues, allValues) => {
    if (changedValues && changedValues.contactId) {
      const { contactId } = changedValues;
      setContactId(contactId);
    }

    if (changedValues && changedValues.paymentMode) {
      const { paymentMode } = changedValues;
      setFormData({ ...formData, paymentMode });
    }
    if (changedValues && changedValues.paymentType) {
      const { paymentType } = changedValues;
      setFormData({ ...formData, paymentType });
    }
    if (
      changedValues &&
      Object.keys(changedValues).includes('runningPayment')
    ) {
      const { runningPayment } = changedValues;
      setFormData({ ...formData, runningPayment });
    }
  };

  return (
    <WrapperPaymentsForm>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        onValuesChange={handleChangedValue}
        // onValuesChange={handleChangedValue}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormLabel>Date</FormLabel>
            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Date is required !' }]}
            >
              <DatePicker style={{ width: '100%' }} size="middle" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>Payment Mode</FormLabel>
            <Form.Item
              name="paymentMode"
              rules={[
                { required: true, message: 'Please select payment mode' },
              ]}
            >
              <Select
                size="middle"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Type"
                optionFilterProp="children"
              >
                {[
                  { value: TRANSACTION_MODE.PAYABLES, name: 'Payables' },
                  {
                    value: TRANSACTION_MODE.RECEIVABLES,
                    name: 'Receivables',
                  },
                ].map((type, index) => {
                  return (
                    <Option key={index} value={type.value}>
                      {type.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>Contact</FormLabel>
            <Form.Item
              name="contactId"
              rules={[{ required: true, message: 'Contact is required !' }]}
            >
              <Select
                loading={isLoading}
                size="middle"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Contact"
                optionFilterProp="children"
              >
                {getContactAgaintPaymentType().map((contact, index) => {
                  return (
                    <Option key={index} value={contact.id}>
                      {contact.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormLabel>Reference</FormLabel>
            <Form.Item
              rules={[
                { required: true, message: 'Reference is required!' },
                {
                  pattern: /^\S/,
                  message: 'Please remove Whitespaces ',
                },
              ]}
              name="reference"
            >
              <Input
                autoComplete="off"
                style={{ width: '100%' }}
                size="middle"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <FormLabel>Payment Type</FormLabel>
            <Form.Item
              name="paymentType"
              rules={[
                { required: true, message: 'Please select payment mode' },
              ]}
            >
              <Select
                size="middle"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select Type"
                optionFilterProp="children"
              >
                {[
                  // { value: PaymentType.BANK, name: 'Bank' },
                  { value: PaymentType.CASH, name: 'Cash' },
                ].map((type, index) => {
                  return (
                    <Option key={index} value={type.value}>
                      {type.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {paymentTypeSelected === PaymentType.BANK && (
              <>
                <FormLabel>Select Bank</FormLabel>
                <div className="pv-2">
                  <Form.Item name="accountId">
                    <Select
                      loading={isLoading}
                      size="middle"
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
                </div>
              </>
            )}
          </Col>
          <Col span={12}>
            <Form.Item name="runningPayment" valuePropName="checked">
              <Checkbox
                onChange={(e) => {
                  form.validateFields();
                }}
              >
                Is Running payment
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <div
              className={`pv-10 ${
                contact_id && !formData.runningPayment
                  ? 'table_visible'
                  : `table_disable`
              }`}
            >
              <CommonTable
                data={!contact_id ? [] : _invoiceData}
                columns={Columns(
                  _invoiceData,
                  _setInvoiceData,
                  contactInvoices
                )}
                hasfooter={false}
                pagination={false}
                size={'small'}
                scroll={{ y: 200 }}
              />
              <div className="mt-10">
                <Button
                  className="flex alignCenter"
                  disabled={!contact_id}
                  size="middle"
                  onClick={() => {
                    const allItems = [..._invoiceData];
                    allItems.push({
                      id: null,
                      reference: '',
                      issueDate: '',
                      invoice_items: [],
                      grossTotal: 0,
                      netTotal: 0,
                      discount: 0,
                      balance: 0,
                    });
                    _setInvoiceData(allItems);
                  }}
                  type="primary"
                  ghost
                >
                  <span className="flex alignCenter mr-10">
                    <Icon icon={bxPlus} />
                  </span>
                  Add Line
                </Button>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className="flex alginCenter">
              <p className="bold">Note:&nbsp;</p>{' '}
              <FormLabel>Add a Description about this transaction</FormLabel>
            </div>
            <Form.Item
              name="comment"
              rules={[
                { required: true, message: 'Please specify payment' },
                {
                  pattern: /^\S/,
                  message: 'Please remove Whitespaces ',
                },
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={9} offset={1}>
            <div className="total_area">
              {contact_id && (
                <>
                  <div className="flex alignItemsEnd justifySpaceBetween mb-10">
                    <p className="bold default fs-16">Cutsomer Balance</p>
                    <p className="default fs-16 flex-1 textRight">
                      {moneyFormat(
                        Math.abs(getCustomerBalance()[0]?.balance || 0)
                      )}
                    </p>
                  </div>
                  <hr className="sep" />
                </>
              )}

              <div className="flex alignItemsEnd justifySpaceBetween">
                <p className="bold default fs-16">Total Amount</p>
                <p className="default fs-16 flex-1 textRight">
                  {moneyFormat(Math.abs(balance))}
                </p>
              </div>
              <div className="flex alignItemsEnd justifySpaceBetween ">
                <p className="bold default fs-16">Amount Paid</p>

                <Form.Item
                  className="amount_input flex-1 textRight"
                  name="amount"
                  getValueFromEvent={(value) => {
                    if (value === null) {
                      setAmountPaid(0);
                      return 0;
                    } else {
                      setAmountPaid(value);
                      return value;
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Amount is required',
                    },
                    {
                      validator: async (rule, value) => {
                        if (value === 0) {
                          throw new Error(`Value should be greater than 0`);
                        }
                      },
                    },
                    {
                      validator: async (rule, value, callback) => {
                        if (
                          parseInt(value) > Math.abs(balance) &&
                          !form.getFieldValue('runningPayment')
                        ) {
                          throw new Error(
                            `Value should be less than ${balance}`
                          );
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber size="middle" autoComplete="off" />
                </Form.Item>
              </div>
              <hr className="sep" />
              <div className="flex alignItemsEnd justifySpaceBetween ">
                <p className="bold default fs-16">Remaining</p>
                <p className="default fs-16 flex-1 textRight">
                  {moneyFormat(remainingTotal)}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Form.Item>
          <div className="actions">
            <Button
              className="mr-10"
              onClick={() => {
                form.resetFields();
                setPaymentsModalConfig(false);
              }}
              type="default"
              size="middle"
            >
              Cancel
            </Button>
            <Button
              loading={paymentMutateLoading}
              type="primary"
              size="middle"
              htmlType="submit"
            >
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </WrapperPaymentsForm>
  );
};
const WrapperPaymentsForm = styled.div`
  .ant-form-item-explain {
    position: absolute;
    right: 0;
    top: -22px;
  }

  .ant-form-item {
    margin-bottom: 13px;
  }
  .amount_input {
    margin-bottom: 0 !important;
    margin-top: 13px;
  }

  .actions {
    text-align: right;
  }

  .table_disable {
    height: 0px;
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
    transition: 1s all ease-in-out;
  }

  .table_visible {
    height: 100%;
    visibility: visible;
    overflow: auto;
    opacity: 1;
  }

  .sep {
    border: 1px solid #ececec;
  }

  .flex-1 {
    flex: 1;
  }
`;
