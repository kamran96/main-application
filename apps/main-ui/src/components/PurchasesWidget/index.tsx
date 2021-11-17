import bxPlus from '@iconify-icons/bx/bx-plus';
import printIcon from '@iconify-icons/bytesize/print';
import Icon from '@iconify/react';
import { EditableTable } from '@invyce/editable-table';
import { invycePersist } from '@invyce/invyce-persist';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { FC, useRef, useState } from 'react';
import { createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { queryCache, useMutation } from 'react-query';

import { createPurchaseEntryAPI, InvoiceCreateAPI } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import {
  IErrorMessages,
  IServerError,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
} from '../../modal';
import { IInvoiceStatus, IInvoiceType, ITaxTypes } from '../../modal/invoice';
import { IOrganizationType } from '../../modal/organization';
import { addition } from '../../utils/helperFunctions';
import moneyFormat from '../../utils/moneyFormat';
import printDiv, { DownloadPDF } from '../../utils/Print';
import { ConfirmModal } from '../ConfirmModal';
import { DatePicker } from '../DatePicker';
import { FormLabel } from '../FormLabel';
import { Payment } from '../Payment';
import { PrintFormat } from '../PrintFormat';
import { Rbac } from '../Rbac';
import { PERMISSIONS } from '../Rbac/permissions';
import { Seprator } from '../Seprator';
import defaultItems from './defaultStates';
import { DragableBodyRow } from './draggable';
import c from './keys';
import { PrintViewPurchaseWidget } from './PrintViewPurchaseWidget';
import { WrapperInvoiceForm } from './styles';
import { PurchaseManager, usePurchaseWidget } from './WidgetManager';

const RNDContext = createDndContext(HTML5Backend);

const { Option } = Select;

enum ISUBMITTYPE {
  RETURN = 'RETURN',
  APPROVE_PRINT = 'APPROVE&PRINT',
  ONLYAPPROVE = 'ONLYAPPROVE',
  DRAFT = 'DRAFT',
}

interface IProps {
  type?: 'BILL' | 'SI' | 'POE' | 'PO' | 'QO';
  id?: number;
}

interface IPaymentPayload {
  paymentMode: number;
  totalAmount: number;
  totalDiscount: number;
  dueDate: string;
  paymentType?: number;
  bankId?: number;
  amount?: number;
}

let debounce;

const Editor: FC<IProps> = ({ type, id }) => {
  /* ************ HOOKS *************** */
  /* Component State Hooks */
  const { routeHistory, userDetails } = useGlobalContext();
  const { organization } = userDetails;
  const { history } = routeHistory;
  const [issueDate, setIssueDate] = useState(dayjs());
  const [printModal, setPrintModal] = useState(false);
  const [taxType, setTaxType] = useState<ITaxTypes>(ITaxTypes.TAX_INCLUSIVE);

  const {
    rowsErrors,
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
    setPayment,
    AntForm,
    moveRow,
    isFetching,
    paymentReset,
    handleAddRow,
    ClearAll,
  } = usePurchaseWidget();

  const __columns =
    taxType === ITaxTypes.NO_TAX
      ? columns.filter((item) => item.dataIndex !== 'tax')
      : columns;

  const printRef = useRef();

  /* Context API hook that manages some sort of states throughout the app */
  /* NotificationCallBack is a function to render notification on API calls sucess and failed */
  const { notificationCallback, handleUploadPDF } = useGlobalContext();

  const APISTAKE =
    type === IInvoiceType.PURCHASE_ENTRY || type === IInvoiceType.BILL
      ? createPurchaseEntryAPI
      : InvoiceCreateAPI;
  /* React Query useMutation hook and ASYNC method to create invoice */
  const [muatateCreateInvoice, resMutateInvoice] = useMutation(APISTAKE);
  const [submitType, setSubmitType] = useState('');
  /* ********** HOOKS ENDS HERE ************** */

  const onPrint = () => {
    const printItem = printRef.current;
    printDiv(printItem);
  };

  const onSendPDF = (contactId, message) => {
    const printItem = printRef.current;
    let email = ``;

    const [filteredContact] = contactResult.filter(
      (cont) => cont.id === contactId
    );

    if (filteredContact) {
      email = filteredContact.email;
    }

    const pdf = DownloadPDF(printItem);
    const payload = {
      email,
      html: `${pdf}`,
      message,
    };
    handleUploadPDF(payload);
  };

  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  const onFinish = async (value) => {
    const InvoiceItemsValidation = [];

    organization?.organizationType !== IOrganizationType.ENTERPRISE &&
      invoiceItems.forEach(async (i, index) => {
        if (i.itemId === null) {
          InvoiceItemsValidation.push(index + 1);
        }
      });

    if (InvoiceItemsValidation.length > 0) {
      notificationCallback(
        NOTIFICATIONTYPE.ERROR,
        `Error in [${InvoiceItemsValidation.map((i) => {
          return `${i}`;
        })}] Please Select any item otherwise delete empty row.`
      );
    } else {
      const paymentData = { ...payment };
      delete paymentData.totalAmount;
      delete paymentData.totalDiscount;

      let payload = {
        ...value,
        status: value.status.status,
        invoiceType: type ? type : IInvoiceType.INVOICE,
        discount: addition(
          typeof invoiceDiscount === 'string'
            ? parseInt(invoiceDiscount)
            : invoiceDiscount,
          TotalDiscount
        ),
        netTotal: NetTotal,
        grossTotal: GrossTotal,
        total: '',
        isNewRecord: true,

        invoice_items: invoiceItems.map((item, index) => {
          return { ...item, sequence: index };
        }),
      };
      // let payments = {
      //   ...paymentData,
      //   amount:
      //     payment.paymentMode === PaymentMode.CREDIT
      //       ? 0
      //       : payment.paymentMode === PaymentMode.CASH
      //       ? NetTotal
      //       : parseFloat(payment.amount),
      // };

      // if (type !== IInvoiceType.QUOTE && payload.invoice.status !== 2) {
      //   if (payments.paymentMode === PaymentMode.CASH) {
      //     delete payments.dueDate;
      //   }

      //   payload.payment = payments;
      // }

      delete payload?.invoiceDiscount;
      delete payload?.total;

      if (id) {
        payload = {
          ...payload,
          id,
          isNewRecord: history?.location?.search?.includes('relation')
            ? true
            : false,
          deleted_ids: deleteIds,
        };
      }
      if (history?.location?.search?.includes('relation')) {
        const relation = history?.location?.search?.split('relation=')[1];
        payload.relation = relation;
      }

      try {
        await muatateCreateInvoice(payload, {
          onSuccess: () => {
            notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Invoice Created');
            if (value && value.status.print) {
              setPrintModal(true);
            }

            if (payload.status !== 2) {
              if (
                type !== IInvoiceType.PURCHASE_ENTRY &&
                type !== IInvoiceType.QUOTE
              ) {
                const messages = {
                  invoice: `Invoice from ${userDetails?.organization?.name}, ${userDetails?.branch?.name} Branch \n ${payload.reference}`,
                  quotes: `Quotation from ${userDetails?.organization?.name}, ${userDetails?.branch?.name} Branch \n ${payload.reference}`,
                };

                onSendPDF(
                  value.contactId,
                  type === IInvoiceType.INVOICE
                    ? messages.invoice
                    : messages.quotes
                );
              }
            }

            ClearAll();

            [
              'invoices',
              'transactions?page',
              'items?page',
              'invoice-view',
              'ledger-contact',
              'all-items',
            ].forEach((key) => {
              queryCache.invalidateQueries((q) =>
                q.queryKey[0].toString().startsWith(key)
              );
            });
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
                IErrorMessages.NETWORK_ERROR
              );
            }
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onCancelPrint = () => {
    setPrintModal(false);
    ClearAll();
    if (id) {
      queryCache.removeQueries(`${type}-${id}-view`);
      let route = history.location.pathname.split('/');
      if (route.length > 3) {
        const removeIndex = route.length - 1;
        route.splice(removeIndex, 1);
        route = route.join('/');
      } else {
        route = route.join('/');
      }

      history.push(route);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  /* Conditional Rendereing form lables for specific inputs */
  const formLabels = {
    to:
      type === IInvoiceType.PURCHASE_ENTRY
        ? `Contact`
        : type === IInvoiceType.INVOICE
        ? `To`
        : type === IInvoiceType.BILL
        ? 'From'
        : 'Contact',
    ref: 'Reference',
    issue_date:
      type === IInvoiceType.PURCHASE_ENTRY || type === IInvoiceType.INVOICE
        ? 'Issue Date'
        : type === IInvoiceType.BILL
        ? 'Date'
        : type === IInvoiceType.QUOTE
        ? 'Date'
        : 'Issue Date',
    due_date:
      type === IInvoiceType.INVOICE || type === IInvoiceType.BILL
        ? 'Due Date'
        : type === IInvoiceType.PURCHASE_ENTRY
        ? 'Delivery Date'
        : type === IInvoiceType.QUOTE
        ? 'Expiry'
        : 'Due Date',
    orderNo:
      type === IInvoiceType.INVOICE
        ? 'Invoice #'
        : type === IInvoiceType.PURCHASE_ENTRY
        ? 'Order No'
        : 'Order No',
  };

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const manager = useRef(RNDContext);

  /* JSX  */
  return (
    <WrapperInvoiceForm>
      <div ref={printRef} className="_visibleOnPrint">
        <PrintFormat>
          <PrintViewPurchaseWidget
            type={
              type === IInvoiceType.PURCHASE_ENTRY
                ? IInvoiceType.PURCHASE_ORDER
                : type
            }
            heading={
              type === IInvoiceType.INVOICE
                ? 'Sale Invoice'
                : type === IInvoiceType.BILL
                ? IInvoiceType.BILL
                : type === IInvoiceType.QUOTE
                ? 'Quotation'
                : ''
            }
            hideCalculation={
              type === IInvoiceType.INVOICE ||
              type === IInvoiceType.PURCHASE_ENTRY
                ? false
                : true
            }
            data={
              (resMutateInvoice &&
                resMutateInvoice.data &&
                resMutateInvoice.data.data &&
                resMutateInvoice.data.data.result) ||
              {}
            }
          />
        </PrintFormat>
      </div>
      <div className=" _disable_print">
        <Form
          form={AntForm}
          onFinish={onFinish}
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
                  <Col span={6}>
                    <FormLabel>{formLabels.to}</FormLabel>
                    <Form.Item
                      name="contactId"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <Select
                        loading={isFetching}
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Contact"
                        optionFilterProp="children"
                        onChange={(val) => {
                          if (val !== 'newContact') {
                            AntForm.setFieldsValue({ contactId: val });
                          }
                        }}
                      >
                        <Option value={'contact-create'}>
                          <Button
                            onClick={() => {
                              history.push(
                                `/app${ISupportedRoutes.CREATE_CONTACT}`
                              );
                            }}
                            type="link"
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
                  <Col span={6}>
                    <FormLabel>{formLabels.ref}</FormLabel>
                    <Form.Item
                      name="reference"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <Input size="middle" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <FormLabel>{formLabels.issue_date}</FormLabel>
                    <Form.Item
                      name="issueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
                        onChange={(date) => {
                          setIssueDate(date);
                          setPayment({ ...payment, dueDate: date });
                        }}
                        disabledDate={(current) => {
                          return current > dayjs().endOf('day');
                        }}
                        style={{ width: '100%' }}
                        size="middle"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <FormLabel>{formLabels.orderNo}</FormLabel>
                    <Form.Item
                      name="invoiceNumber"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Input disabled size="middle" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={6} className="_custom_col_refheader">
                {type !== IInvoiceType.BILL && (
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
                )}
              </Col>
            </Row>
          </div>
          <EditableTable
            loading={isFetching}
            dragable={(data) => setInvoiceItems(data)}
            columns={__columns}
            data={invoiceItems}
            scrollable={{ offsetY: 400, offsetX: 0 }}
          />

          {/* <DndProvider manager={manager.current.dragDropManager}>
              <CommonTable
                rowClassName={(record, index) =>
                  ` ${
                    rowsErrors[index] &&
                    rowsErrors[index].hasError &&
                    "row_warning" 
                  } `
                }
                loading={isFetching}
                
              
                dataSource={invoiceItems}
                columns={__columns}
                pagination={false}
                scroll={{ y: 350 }}
                // scroll={{ y: 350, x: 0 }}
                // components={components}
                onRow={(record: any, index: any) => {
                  let row: any = {
                    index,
                    moveRow,
                  };
                  return {
                    ...row,
                  };
                }}
              />
            </DndProvider> */}
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
              Add line item
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
                    <p className="bold">Items Discount</p>
                  </Col>
                  <Col span={12}>
                    <p className="light textRight">
                      {TotalDiscount
                        ? moneyFormat(TotalDiscount)
                        : moneyFormat(0)}
                    </p>
                  </Col>
                  <Col className="flex alignCenter" span={12}>
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
                              setInvoiceDiscount(value as number);
                            }, 400);
                          }}
                          size="middle"
                        />
                      </Form.Item>
                    </div>
                  </Col>
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
                  <Button onClick={ClearAll} size={'middle'} type="default">
                    Cancel
                  </Button>
                  <Button
                    loading={
                      resMutateInvoice.isLoading &&
                      submitType === ISUBMITTYPE.DRAFT
                    }
                    disabled={resMutateInvoice.isLoading}
                    htmlType="submit"
                    size={'middle'}
                    onClick={() => {
                      setSubmitType(ISUBMITTYPE.DRAFT);
                      AntForm.setFieldsValue({
                        status: {
                          status: IInvoiceStatus.draft,
                          print: false,
                        },
                      });
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
                          disabled={resMutateInvoice.isLoading}
                          loading={
                            resMutateInvoice.isLoading &&
                            submitType === ISUBMITTYPE.RETURN
                          }
                          htmlType="submit"
                          size={'middle'}
                          onClick={() => {
                            setSubmitType(ISUBMITTYPE.RETURN);
                            AntForm.setFieldsValue({
                              status: {
                                status: IInvoiceStatus.returned,
                                print: false,
                              },
                            });
                          }}
                        >
                          Return
                        </Button>

                        <Button
                          disabled={resMutateInvoice.isLoading}
                          loading={
                            resMutateInvoice.isLoading &&
                            submitType === ISUBMITTYPE.APPROVE_PRINT
                          }
                          htmlType="submit"
                          size={'middle'}
                          type="primary"
                          onClick={() => {
                            setSubmitType(ISUBMITTYPE.APPROVE_PRINT);
                            AntForm.setFieldsValue({
                              status: {
                                status: IInvoiceStatus.approve,
                                print: true,
                              },
                            });
                          }}
                        >
                          <span className="flex alignCenter ">
                            <Icon icon={printIcon} className="mr-10" />
                            Approve and Print
                          </span>
                        </Button>
                        <Button
                          disabled={resMutateInvoice.isLoading}
                          loading={
                            resMutateInvoice.isLoading &&
                            submitType === ISUBMITTYPE.ONLYAPPROVE
                          }
                          htmlType="submit"
                          size={'middle'}
                          type="primary"
                          onClick={() => {
                            setSubmitType(ISUBMITTYPE.ONLYAPPROVE);
                            AntForm.setFieldsValue({
                              status: {
                                status: IInvoiceStatus.approve,
                                print: false,
                              },
                            });
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
    </WrapperInvoiceForm>
  );
};

export const PurchasesWidget: FC<IProps> = (props) => {
  return (
    <PurchaseManager {...props}>
      <Editor {...props} />
    </PurchaseManager>
  );
};
