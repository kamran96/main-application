import bxPlus from '@iconify-icons/bx/bx-plus';
import printIcon from '@iconify-icons/bytesize/print';
import Icon from '@iconify/react';
import { EditableTable } from '@invyce/editable-table';
import { IContact } from '@invyce/interfaces';
import { invycePersist } from '@invyce/invyce-persist';
import {
  IContactTypes,
  QueryInvalidate,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import {
  getInvoiceNumber,
  InvoiceCreateAPI,
  create_update_contact,
} from '../../../../api';
import {
  ConfirmModal,
  DatePicker,
  FormLabel,
  PrintFormat,
  PrintViewPurchaseWidget,
  Seprator,
} from '@components';
import { Rbac } from '../../../../components/Rbac';
import { PERMISSIONS } from '../../../../components/Rbac/permissions';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
  ISupportedRoutes,
  IInvoiceType,
  ITaxTypes,
} from '@invyce/shared/types';
import { addition } from '../../../../utils/helperFunctions';
import moneyFormat from '../../../../utils/moneyFormat';
import printDiv from '../../../../utils/Print';
import { PurchaseManager, usePurchaseWidget } from './EditorManager';
import c from './keys';
import { WrapperInvoiceForm } from './styles';

const { Option } = Select;

enum ISUBMITTYPE {
  RETURN = 'RETURN',
  APPROVE_PRINT = 'APPROVE&PRINT',
  ONLYAPPROVE = 'ONLYAPPROVE',
  DRAFT = 'DRAFT',
}

interface IProps {
  type?: 'SI' | 'QO';
  id?: number;
  onSubmit?: (payload: any) => void;
}

let debounce: any;

const Editor: FC<IProps> = ({ type, id, onSubmit }) => {
  const queryCache = useQueryClient();
  /* ************ HOOKS *************** */
  /* Component State Hooks */
  const history = useHistory();
  const [printModal, setPrintModal] = useState(false);
  const [creditLimitModal, setCreditLimitModal] = useState({
    visibility: false,
    contact: '',
  });
  const [taxType, setTaxType] = useState<ITaxTypes>(ITaxTypes.TAX_INCLUSIVE);
  const [createContactName, setCreateContactName] = useState('');
  const [emailModal, setEmailModal] = useState(false);
  const [contactEmail, setContactEmail] = useState(null);
  const [contactError, setContactError] = useState<boolean>(false);

  const {
    columns,
    contactResult,
    GrossTotal,
    TotalDiscount,
    NetTotal,
    invoiceDiscount,
    setInvoiceDiscount,
    invoiceItems,
    setInvoiceItems,
    deleteIds,
    payment,
    setIssueDate,
    AntForm,
    isFetching,
    handleAddRow,
    ClearAll,
    handleCheckValidation,
    bypassCreditLimit,
    setBypassCreditLimit,
    rowsErrors,
  } = usePurchaseWidget();

  const __columns =
    taxType === ITaxTypes.NO_TAX
      ? columns.filter((item) => item.dataIndex !== 'tax')
      : columns;

  const printRef = useRef();

  /* Context API hook that manages some sort of states throughout the app */
  /* NotificationCallBack is a function to render notification on API calls sucess and failed */
  const { notificationCallback, handleUploadPDF } = useGlobalContext();

  const APISTAKE = InvoiceCreateAPI;
  /* React Query useMutation hook and ASYNC method to create invoice */
  const {
    mutate: muatateCreateInvoice,
    isLoading: invoiceCreating,
    data: responseInvoice,
  } = useMutation(APISTAKE);
  //  CONTACT CREATE API
  const { mutate: mutateCreateContact, isLoading: creatingContact } =
    useMutation(create_update_contact);
  const [submitType, setSubmitType] = useState('');
  /* ********** HOOKS ENDS HERE ************** */

  const { data: invoiceNumberData, refetch: refetchInvoiceNumber } = useQuery(
    [],
    getInvoiceNumber
  );

  useEffect(() => {
    if (invoiceNumberData?.data?.result) {
      const { result } = invoiceNumberData?.data;
      AntForm.setFieldsValue({ invoiceNumber: result });
    }
  }, [invoiceNumberData]);

  const onPrint = () => {
    const printItem = printRef.current;
    printDiv(printItem);
  };

  const onCreateContact = async () => {
    await mutateCreateContact(
      { name: createContactName, contactType: IContactTypes.CUSTOMER },
      {
        onSuccess: (data) => {
          queryCache?.invalidateQueries('all-contacts');
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Contact Created');
          // AntForm.setFieldsValue({contactId: createContactName});
          setCreateContactName('');
        },
      }
    );
  };

  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */

  const onFinish = async (value) => {
    const email =
      contactEmail || getContactById(value?.contactId)?.email || null;

    const errors = handleCheckValidation(invoiceItems);

    if (!errors.length) {
      const paymentData = { ...payment };
      delete paymentData.totalAmount;
      delete paymentData.totalDiscount;

      let payload: any = {
        ...value,
        email,
        status: value.status.status,
        invoiceType: type ? type : IInvoiceType.INVOICE,
        discount: addition(invoiceDiscount, TotalDiscount),
        netTotal: NetTotal,
        grossTotal: GrossTotal,
        total: '',
        isNewRecord: true,

        invoice_items: invoiceItems.map((item, index) => {
          delete item?.rerender;
          return { ...item, sequence: index };
        }),
      };

      delete payload.invoiceDiscount;
      delete payload.total;

      if (id) {
        payload = {
          ...payload,
          id,
          isNewRecord: false,
          deleted_ids: deleteIds,
        };
      }

      await muatateCreateInvoice(payload, {
        onSuccess: (data) => {
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Invoice Created');
          const { id: invoiceId } = data?.data?.result;
          if (value && value.status.print) {
            setPrintModal(true);
          }

          ClearAll();

          /* this will clear invoice items, formdata and payment */
          refetchInvoiceNumber();

          QueryInvalidate.invoices.forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          history.push(
            `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.INVOICES_VIEW}/${invoiceId}`
          );
        },
        onError: (error: IServerError) => {
          if (error?.response?.data?.message) {
            const { message } = error.response.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, message);
          } else {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              IErrorMessages.NETWORK_ERROR
            );
          }
        },
      });
    }
  };
  const onCancelPrint = () => {
    setPrintModal(false);
    ClearAll();
    if (id) {
      queryCache.removeQueries(`${type}-${id}-view`);
      const route = history.location.pathname.split('/');
      if (route.length > 3) {
        const removeIndex = route.length - 1;
        route.splice(removeIndex, 1);
      }

      history.push(route?.join('/'));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  /* Conditional Rendereing form lables for specific inputs */
  const formLabels = {
    to: type === IInvoiceType.INVOICE ? `To` : 'Contact',
    ref: 'Reference',
    issue_date:
      type === IInvoiceType.INVOICE
        ? 'Issue Date'
        : type === IInvoiceType.QUOTE
        ? 'Date'
        : 'Issue Date',
    due_date:
      type === IInvoiceType.INVOICE
        ? 'Due Date'
        : type === IInvoiceType.QUOTE
        ? 'Expiry'
        : 'Due Date',
    orderNo: type === IInvoiceType.INVOICE ? 'Invoice #' : 'Order No',
  };

  const getContactById = (id) => {
    const [filteredContact] = contactResult.filter((cont) => cont.id === id);
    return filteredContact;
  };

  const handleSubmit = (values) => {
    const contact: IContact = getContactById(values?.contactId);
    if (
      contact?.balance >= contact?.creditLimitBlock ||
      NetTotal > contact?.creditLimitBlock
    ) {
      notificationCallback(
        NOTIFICATIONTYPE.WARNING,
        'Contact has reached credit block limit, Invoice cannot be created'
      );
    } else if (
      contact?.balance >= contact.creditLimit ||
      (NetTotal > contact?.creditLimit && !bypassCreditLimit)
    ) {
      setCreditLimitModal({ visibility: true, contact: contact?.name });
    } else {
      onFinish(values);
    }
  };

  /* JSX  */
  return (
    <WrapperInvoiceForm>
      <div ref={printRef} className="_visibleOnPrint">
        <PrintFormat>
          <PrintViewPurchaseWidget
            type={type}
            heading={
              type === IInvoiceType.INVOICE
                ? 'Sale Invoice'
                : type === IInvoiceType.QUOTE
                ? 'Quotation'
                : ''
            }
            hideCalculation={type === IInvoiceType.INVOICE ? false : true}
            data={{ ...responseInvoice?.data?.result } || {}}
          />
        </PrintFormat>
      </div>
      <div className=" _disable_print">
        <Form
          form={AntForm}
          // onFinish={}
          onFinishFailed={onFinishFailed}
          onValuesChange={(changedField, allvalues) => {
            const _formData =
              invycePersist(c.ANTFORMCACHE + type, '', 'localStorage').get() ||
              null;
            invycePersist(
              c.ANTFORMCACHE + type,
              { ..._formData, ...allvalues },
              'localStorage'
            ).set();

            if (changedField?.isTaxIncluded) {
              setTaxType(changedField?.isTaxIncluded);
            }
          }}
        >
          <div className="refrence-header">
            <Row gutter={24} className="w-100 _custom_row_refheader">
              <Col className="_custom_col_refheader" span={18}>
                <Row gutter={24}>
                  <Col span={5}>
                    <FormLabel>{formLabels.to}</FormLabel>
                    <Form.Item
                      name="contactId"
                      rules={[{ required: true, message: 'Required !' }]}
                      validateStatus={contactError ? 'error' : 'success'}
                    >
                      <Select
                        loading={isFetching}
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Contact"
                        onSearch={(val) => setCreateContactName(val)}
                        onChange={(val) => setContactError(false)}
                        // optionFilterProp="children"
                        filterOption={(input, option) => {
                          const valueInput = input.toLowerCase();
                          // setCreateContactName(input);
                          const child: string = option.children as any;
                          if (typeof option?.children === 'string') {
                            return child.toLowerCase().includes(valueInput);
                          } else {
                            return true;
                          }
                        }}
                      >
                        <Option
                          key={'new-contact'}
                          style={{
                            textAlign: 'left',
                          }}
                          value={'contact-create'}
                        >
                          <Button
                            className="new-contact-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (createContactName.replace(/\s/g, '') !== '') {
                                onCreateContact();
                                setContactError(false);
                              } else {
                                setContactError(true);
                              }
                            }}
                            type="text"
                            size="middle"
                          >
                            Create Contact
                          </Button>
                        </Option>

                        {contactResult.map((contact, index) => {
                          return (
                            <Option key={index} value={contact.id}>
                              {contact.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <FormLabel>{formLabels.ref}</FormLabel>
                    <Form.Item
                      name="reference"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <Input size="middle" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <FormLabel>{formLabels.issue_date}</FormLabel>
                    <Form.Item
                      name="issueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
                        // onChange={(date) => {
                        //   setIssueDate(date);
                        // }}
                        disabledDate={(current) => {
                          return current > dayjs().endOf('day');
                        }}
                        style={{ width: '100%' }}
                        size="middle"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <FormLabel>{formLabels.due_date}</FormLabel>
                    <Form.Item
                      name="dueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
                        disabledDate={(current) => {
                          return current < dayjs().endOf('day');
                        }}
                        style={{ width: '100%' }}
                        size="middle"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <FormLabel>{formLabels.orderNo}</FormLabel>
                    <Form.Item
                      name="invoiceNumber"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Input disabled size="middle" type="text" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={6} className="_custom_col_refheader">
                <Row gutter={24}>
                  <Col span={12}>
                    <FormLabel>Currency</FormLabel>
                    <Form.Item
                      name="currency"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Select
                        disabled
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Currency"
                        optionFilterProp="children"
                      >
                        {['PKR', ' USD', ' CND', 'EUR'].map((curr, index) => {
                          return (
                            <Option key={index} value={curr}>
                              {curr}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <FormLabel>Amount Are</FormLabel>
                    <Form.Item
                      name="isTaxIncluded"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Select
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Tax"
                        optionFilterProp="children"
                      >
                        {[
                          {
                            name: 'Tax Included',
                            val: ITaxTypes.TAX_INCLUSIVE,
                          },
                          {
                            name: ' Tax Exempted',
                            val: ITaxTypes.TAX_EXCLUSIVE,
                          },
                          { name: 'No Tax', val: ITaxTypes.NO_TAX },
                        ].map((tax, index) => {
                          return (
                            <Option key={index} value={tax.val}>
                              {tax.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="table_area">
            <EditableTable
              // rowClassName={(record, index) => ""}
              loading={isFetching}
              dragable={(data) => setInvoiceItems(data)}
              columns={__columns}
              data={invoiceItems}
              scrollable={{ offsetY: 400, offsetX: 0 }}
            />
          </div>
          <div className="add_item">
            <Button
              className="flex alignCenter"
              onClick={handleAddRow}
              type="primary"
              ghost
            >
              <span className="flex alignCenter mr-10">
                <Icon icon={bxPlus} />
              </span>
              Add Invoice item
            </Button>
          </div>
          <div className="total_invoice">
            <Row gutter={24}>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 10, offset: 2, pull: 2 }}
                xxl={{ span: 6, offset: 6, pull: 6 }}
              >
                {type === IInvoiceType.QUOTE && (
                  <div className="description">
                    <FormLabel>
                      Term: to set and reuse terms, edit your blanding theme in
                      <br />
                      invoice settings
                    </FormLabel>
                    <Form.Item
                      name="comment"
                      rules={[
                        { required: true, message: 'Comment is required' },
                      ]}
                    >
                      <TextArea className="mh-10" rows={4} />
                    </Form.Item>
                  </div>
                )}
              </Col>
              <Col
                xs={{ span: 8, offset: 4 }}
                sm={{ span: 8, offset: 4 }}
                md={{ span: 8, offset: 4 }}
                lg={{ span: 8, offset: 4 }}
                xl={{ span: 8, offset: 4 }}
                xxl={{ span: 6, offset: 6 }}
              >
                <Row gutter={24} className="_total_aggragate">
                  <Col span={12}>
                    <p className="bold">Gross Total</p>
                  </Col>
                  <Col span={12}>
                    <p className="light textRight">
                      {GrossTotal ? moneyFormat(GrossTotal) : moneyFormat(0)}
                    </p>
                  </Col>
                  <Col className="flex alignCenter" span={12}>
                    <p className="bold">Discount</p>
                  </Col>
                  <Col span={12}>
                    <p className="light textRight">
                      {TotalDiscount
                        ? moneyFormat(TotalDiscount)
                        : moneyFormat(0)}
                    </p>
                  </Col>
                  {/* <Col className="flex alignCenter" span={12}>
                    <p className="bold">Invoice Discount</p>
                  </Col>
                  <Col span={12}>
                    <div className="flex alignCenter justifyFlexEnd">
                      <Form.Item name="invoiceDiscount">
                        <InputNumber
                          onChange={(val) => {
                            const value = val;
                            clearTimeout(debounce);

                            debounce = setTimeout(() => {
                              setInvoiceDiscount(value);
                            }, 400);
                          }}
                          size="middle"
                        />
                      </Form.Item>
                    </div>
                  </Col> */}
                  <Col span={24}>
                    <Seprator />
                  </Col>
                  <Col span={12}>
                    <p className="bold">Net Total</p>
                  </Col>
                  <Col span={12}>
                    <p className="light textRight">{moneyFormat(NetTotal)}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={24}>
              <div className="actions">
                <Form.Item name="status" className="actions_control">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      ClearAll();
                    }}
                    size={'middle'}
                    type="default"
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={
                      invoiceCreating && submitType === ISUBMITTYPE.DRAFT
                    }
                    disabled={invoiceCreating}
                    // htmlType="submit"
                    size={'middle'}
                    onClick={(e) => {
                      e.preventDefault();
                      setSubmitType(ISUBMITTYPE.DRAFT);
                      AntForm.setFieldsValue({
                        status: {
                          status: 2,
                          print: false,
                        },
                      });
                      const value = AntForm?.getFieldsValue();
                      handleSubmit(value);
                    }}
                  >
                    {type === IInvoiceType.QUOTE ? 'Save' : 'Draft'}
                  </Button>
                  {type !== IInvoiceType.QUOTE && (
                    <Rbac
                      permission={
                        type === IInvoiceType.INVOICE
                          ? PERMISSIONS.INVOICES_DRAFT_APPROVE
                          : type === IInvoiceType.PURCHASE_ENTRY
                          ? PERMISSIONS.PURCHASES_DRAFT_APPROVE
                          : PERMISSIONS.INVOICES_DRAFT_APPROVE
                      }
                    >
                      <>
                        <Button
                          disabled={invoiceCreating}
                          loading={
                            invoiceCreating &&
                            submitType === ISUBMITTYPE.APPROVE_PRINT
                          }
                          // htmlType="submit"
                          size={'middle'}
                          type="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setSubmitType(ISUBMITTYPE.APPROVE_PRINT);
                            AntForm.setFieldsValue({
                              status: {
                                status: 1,
                                print: true,
                              },
                            });
                            const value = AntForm?.getFieldsValue();
                            handleSubmit(value);
                          }}
                        >
                          <span className="flex alignCenter ">
                            <Icon icon={printIcon} className="mr-10" />
                            Approve and Print
                          </span>
                        </Button>
                        <Button
                          disabled={invoiceCreating}
                          loading={
                            invoiceCreating &&
                            submitType === ISUBMITTYPE.ONLYAPPROVE
                          }
                          // htmlType={
                          //   getContactById(AntForm.getFieldValue('contactId'))
                          //     ?.email
                          //     ? 'submit'
                          //     : 'button'
                          // }
                          size={'middle'}
                          type="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setSubmitType(ISUBMITTYPE.ONLYAPPROVE);
                            AntForm.setFieldsValue({
                              status: {
                                status: 1,
                                print: false,
                              },
                            });

                            const value = AntForm?.getFieldsValue();
                            handleSubmit(value);

                            const email = getContactById(
                              AntForm.getFieldValue('contactId')
                            )?.email;
                            if (!email) {
                              setEmailModal(true);
                            } else {
                              AntForm.setFieldsValue({ email });
                            }
                          }}
                        >
                          Approve
                        </Button>
                      </>
                    </Rbac>
                  )}
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <ConfirmModal
        visible={printModal}
        onCancel={onCancelPrint}
        onConfirm={onPrint}
        type="info"
        text="Do you want to print?"
      />
      <ConfirmModal
        visible={emailModal}
        onCancel={() => {
          AntForm.submit();
          setEmailModal(false);
        }}
        onConfirm={() => {
          AntForm.submit();
          setEmailModal(false);
        }}
        type="mention"
        confirmText="Send"
        children={
          <Form.Item label="Please Provide email" labelCol={{ span: 24 }}>
            <Input
              onChange={(e) => {
                const value = e.target.value;
                setContactEmail(value);
              }}
              placeholder="example@something.com"
              style={{ width: '100%' }}
              type="email"
              size="middle"
            />
          </Form.Item>
        }
      />
      <ConfirmModal
        visible={creditLimitModal?.visibility}
        onCancel={() => {
          setCreditLimitModal({ visibility: false, contact: '' });
        }}
        onConfirm={() => {
          setBypassCreditLimit(true);
          setTimeout(() => {
            AntForm.submit();
            setCreditLimitModal({ visibility: false, contact: '' });
          }, 300);
        }}
        type="warning"
        text={`${creditLimitModal?.contact} reached credit limit do you want to proceed further?`}
      />
    </WrapperInvoiceForm>
  );
};

export const InvoiceEditor: FC<IProps> = (props) => {
  return (
    <PurchaseManager {...props}>
      <Editor {...props} />
    </PurchaseManager>
  );
};
