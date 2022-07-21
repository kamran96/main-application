import bxPlus from '@iconify-icons/bx/bx-plus';
import printIcon from '@iconify-icons/bytesize/print';
import Icon from '@iconify/react';
import { EditableTable } from '@invyce/editable-table';
import { invycePersist } from '@invyce/invyce-persist';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { FC, useRef, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import {
  create_update_contact,
  createPurchaseEntryAPI,
  InvoiceCreateAPI,
} from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import {
  IErrorMessages,
  IServerError,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
} from '../../modal';
import { IContactTypes } from '../../modal';
import { IInvoiceStatus, IInvoiceType, ITaxTypes } from '../../modal/invoice';
import { addition } from '../../utils/helperFunctions';
import moneyFormat from '../../utils/moneyFormat';
import printDiv from '../../utils/Print';
import { ConfirmModal } from '../ConfirmModal';
import { DatePicker } from '../DatePicker';
import { FormLabel } from '../FormLabel';
import { PrintFormat } from '../PrintFormat';
import { Rbac } from '../Rbac';
import { PERMISSIONS } from '../Rbac/permissions';
import { Seprator } from '../Seprator';
import c from './keys';
import { PrintViewPurchaseWidget } from './PrintViewPurchaseWidget';
import { WrapperInvoiceForm } from './styles';
import { PurchaseManager, usePurchaseWidget } from './WidgetManager';
import { IProps, IPurchaseManagerProps, ISUBMITTYPE } from './types';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

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
  const queryCache = useQueryClient();
  /* ************ HOOKS *************** */
  /* Component State Hooks */
  const { userDetails } = useGlobalContext();
  const history = useHistory();
  const [printModal, setPrintModal] = useState(false);
  const [taxType, setTaxType] = useState<ITaxTypes>(ITaxTypes.TAX_INCLUSIVE);
  const [createContactName, setCreateContactName] = useState('');

  const {
    columns,
    contactResult,
    GrossTotal,
    NetTotal,
    invoiceDiscount,
    setInvoiceDiscount,
    invoiceItems,
    setInvoiceItems,
    deleteIds,
    payment,
    AntForm,
    isFetching,
    handleAddRow,
    ClearAll,
    handleCheckValidation,
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
  const {
    mutate: muatateCreateInvoice,
    isLoading: creatingInvoiceLoading,
    data: responseInvoiceCreatedData,
  } = useMutation(APISTAKE);

  //  CONTACT CREATE API
  const { mutate: mutateCreateContact, isLoading: contactsLoading } =
    useMutation(create_update_contact);
  const [submitType, setSubmitType] = useState('');
  /* ********** HOOKS ENDS HERE ************** */

  const onPrint = () => {
    const printItem = printRef.current;
    printDiv(printItem);
  };

  const onCreateContact = async () => {
    await mutateCreateContact(
      { name: createContactName, contactType: IContactTypes.SUPPLIER },
      {
        onSuccess: (data) => {
          queryCache?.invalidateQueries('all-contacts');
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Contact Created');
        },
      }
    );
  };

  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  const RouteState: any = history?.location?.state;
  const onFinish = async (value) => {
    const errors = handleCheckValidation();

    if (!errors?.length) {

      const paymentData = { ...payment };
      delete paymentData.totalAmount;
      delete paymentData.totalDiscount;


      let payload = {
        ...value,
        status: value.status.status,
        invoiceType: type ? type : IInvoiceType.INVOICE,
        adjustment: addition(
          typeof invoiceDiscount === 'string'
            ? parseInt(invoiceDiscount)
            : invoiceDiscount,
          0
        ).toString(),
        netTotal: NetTotal,
        grossTotal: GrossTotal,
        total: '',
        isNewRecord: true,

        invoice_items: invoiceItems.map((item, index) => {
          return { ...item, sequence: index };
        }),
      };

      delete payload?.invoiceDiscount;
      delete payload?.total;

      if (id) {
        payload = {
          ...payload,

          id,
          isNewRecord: RouteState?.relation ? true : false,
          deleted_ids: deleteIds,
        };
      }
      if (history?.location?.search?.includes('relation')) {
        const relation = history?.location?.search?.split('relation=')[1];
        payload.relation = relation;
      }



      await muatateCreateInvoice(payload, {
        onSuccess: (data) => {
          const { id: invoiceId } = data?.data?.result;
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Invoice Created');
          if (value && value.status.print) {
            setPrintModal(true);
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
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });

          history.push(
            `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.PURCHASES}/${invoiceId}`
          );
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
    }
  };
  const onCancelPrint = () => {
    setPrintModal(false);
    ClearAll();
    if (id) {
      queryCache.removeQueries(`${type}-${id}-view`);
      let route: string[] | string = history.location.pathname.split('/');
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
            data={responseInvoiceCreatedData?.data?.result || {}}
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
                  <Col span={5}>
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
                        // optionFilterProp="children"
                        filterOption={(input, option) => {
                          const valueInput = input.toLowerCase();
                          setCreateContactName(input);
                          const child: string = option.children as any;
                          if (typeof option?.children === 'string') {
                            return child.toLowerCase().includes(valueInput);
                          } else {
                            return true;
                          }
                        }}
                        // onChange={(val) => {
                        //   if (val !== 'newContact') {
                        //     AntForm.setFieldsValue({ contactId: val });
                        //   }
                        // }}
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
                              onCreateContact();
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
                      <Input autoComplete="off" size="middle" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <FormLabel>{formLabels.issue_date}</FormLabel>
                    <Form.Item
                      name="issueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
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
                        // disabledDate={(current) => {
                        //   return current > dayjs().endOf('day');
                        // }}
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
                        rules={[{ required: true, message: 'Required !' }]}
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
                    <p className="bold">Adjustments</p>
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
                      creatingInvoiceLoading && submitType === ISUBMITTYPE.DRAFT
                    }
                    disabled={creatingInvoiceLoading}
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
                          disabled={creatingInvoiceLoading}
                          loading={
                            creatingInvoiceLoading &&
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
                          disabled={creatingInvoiceLoading}
                          loading={
                            creatingInvoiceLoading &&
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

export const PurchasesWidget: FC<IPurchaseManagerProps> = (props) => {
  return (
    <PurchaseManager {...props}>
      <Editor {...props} />
    </PurchaseManager>
  );
};
