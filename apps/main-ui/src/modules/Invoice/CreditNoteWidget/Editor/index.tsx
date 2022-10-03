import bxPlus from '@iconify-icons/bx/bx-plus';
import printIcon from '@iconify-icons/bytesize/print';
import Icon from '@iconify/react';
import { EditableTable } from '@invyce/editable-table';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { IInvoiceType, ITaxTypes, ReactQueryKeys } from '@invyce/shared/types';
import dayjs from 'dayjs';
import { FC, useRef, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { CreditNoteCreateAPI } from '../../../../api';
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
  ISupportedRoutes,
  NOTIFICATIONTYPE,
} from '@invyce/shared/types';
import moneyFormat from '../../../../utils/moneyFormat';
import printDiv, { DownloadPDF } from '../../../../utils/Print';
import defaultItems, { Requires } from './defaultStates';
import { PurchaseManager, usePurchaseWidget } from './EditorManager';
import { WrapperInvoiceForm } from './styles';
import { handleCheckValidation } from './handlers';
import c from './key';
import { invycePersist } from '@invyce/invyce-persist';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

enum ISUBMITTYPE {
  RETURN = 'RETURN',
  APPROVE_PRINT = 'APPROVE&PRINT',
  ONLYAPPROVE = 'ONLYAPPROVE',
  DRAFT = 'DRAFT',
}

interface IProps {
  type?: 'CN';
  id?: number;
  onSubmit?: (payload: any) => void;
}

let debounce: any;

const Editor: FC<IProps> = ({ type = 'credit-note', id, onSubmit }) => {
  /* ************ HOOKS *************** */
  /* Component State Hooks */

  const history = useHistory();
  const [printModal, setPrintModal] = useState(false);
  const [taxType, setTaxType] = useState<ITaxTypes>(ITaxTypes.TAX_INCLUSIVE);

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
    AntForm,
    isFetching,
    handleAddRow,
    ClearAll,
    accountsList,
    relation,
  } = usePurchaseWidget();

  const __columns =
    taxType === ITaxTypes.NO_TAX
      ? columns.filter((item) => item.dataIndex !== 'tax')
      : columns;

  const printRef = useRef();

  /* Context API hook that manages some sort of states throughout the app */
  /* NotificationCallBack is a function to render notification on API calls sucess and failed */
  const { notificationCallback, handleUploadPDF } = useGlobalContext();
  const queryCache = useQueryClient();
  const APISTAKE = CreditNoteCreateAPI;
  /* React Query useMutation hook and ASYNC method to create invoice */
  const {
    mutate: muatateCreateInvoice,
    isLoading: creatingInvoice,
    data: responseCreatedInvoice,
  } = useMutation(APISTAKE);
  const [submitType, setSubmitType] = useState('');
  /* ********** HOOKS ENDS HERE ************** */

  const onPrint = () => {
    const printItem = printRef.current;
    printDiv(printItem);
  };

  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  /* Async Function calls on submit of form to create invoice/Quote/Bills and Purchase Entry  */
  const onFinish = async (value) => {
    const error = handleCheckValidation(invoiceItems, Requires, (val) => {
      setInvoiceItems(val);
    });

    console.log(error, 'error', value, 'value');

    if (!error?.length) {
      const [filteredContact] = contactResult?.filter(
        (i) => i.id === value?.contactId
      );

      console.log(filteredContact, 'filterredContact');

      let payload: any = {
        ...value,
        status: value.status.status,
        invoiceType: IInvoiceType.CREDITNOTE,
        discount: invoiceDiscount,
        netTotal: NetTotal,
        grossTotal: GrossTotal,
        total: '',
        invoiceId: id,
        isNewRecord: true,

        invoice_items: invoiceItems.map((item, index) => {
          return { ...item, sequence: index };
        }),
      };

      delete payload.invoiceDiscount;
      delete payload.total;
      if (id && !relation?.type) {
        payload = {
          ...payload,

          ...payload.invoice,
          id,
          isNewRecord: false,
          deleted_ids: deleteIds,
        };

        delete payload.invoiceId;
      } else if (id && relation?.type) {
        payload.invoiceId = id;
      }

      await muatateCreateInvoice(payload, {
        onSuccess: (data) => {
          const { id: invoiceId } = data?.data?.result;
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Invoice Created');
          if (value && value.status.print) {
            setPrintModal(true);
          }

          ClearAll();
          setInvoiceDiscount(0);
          /* this will clear invoice items, formdata and payment */
          setInvoiceItems([{ ...defaultItems }]);
          [
            ReactQueryKeys?.INVOICES_KEYS,
            ReactQueryKeys?.TRANSACTION_KEYS,
            ReactQueryKeys?.ITEMS_KEYS,
            ReactQueryKeys?.INVOICE_VIEW,
            ReactQueryKeys.CONTACT_VIEW,
            'all-items',
            'ACCRECCREDIT',
            ReactQueryKeys?.CREDITNOTE_KEYS,
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          history?.push(
            `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.CREDIT_NOTES}/${invoiceId}`
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
      let route: any = history.location.pathname.split('/');
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
    to: 'Contact',
    ref: 'Reference',
    issue_date: 'Issue Date',
    due_date: 'Due Date',
    orderNo: 'Invoice #',
  };

  const _match = JSON.stringify(accountsList);

  /* JSX  */
  return (
    <WrapperInvoiceForm>
      <div ref={printRef} className="_visibleOnPrint">
        <PrintFormat>
          <PrintViewPurchaseWidget
            type={'credit-note'}
            heading={'Credit Note'}
            hideCalculation={type === IInvoiceType.INVOICE ? false : true}
            data={responseCreatedInvoice?.data?.result || {}}
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
                      <Input size="middle" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
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

                  <Col span={6}>
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
          <Form>
            <EditableTable
              loading={isFetching}
              dragable={(data) => setInvoiceItems(data)}
              columns={__columns}
              data={invoiceItems}
              scrollable={{ offsetY: 400, offsetX: 0 }}
            />
          </Form>
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
              Add Credit Note item
            </Button>
          </div>
          <div className="total_invoice">
            <Row gutter={24}>
              <Col
                xs={{ span: 8, offset: 16 }}
                sm={{ span: 8, offset: 16 }}
                md={{ span: 8, offset: 16 }}
                lg={{ span: 8, offset: 16 }}
                xl={{ span: 8, offset: 16 }}
                xxl={{ span: 6, offset: 18 }}
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
                    onClick={() => {
                      ClearAll();
                    }}
                    size={'middle'}
                    type="default"
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={
                      creatingInvoice && submitType === ISUBMITTYPE.DRAFT
                    }
                    disabled={creatingInvoice}
                    htmlType="submit"
                    size={'middle'}
                    onClick={() => {
                      setSubmitType(ISUBMITTYPE.DRAFT);
                      AntForm.setFieldsValue({
                        status: {
                          status: 2,
                          print: false,
                        },
                      });
                    }}
                  >
                    Draft
                  </Button>

                  <Rbac permission={PERMISSIONS.INVOICES_DRAFT_APPROVE}>
                    <>
                      <Button
                        disabled={creatingInvoice}
                        loading={
                          creatingInvoice &&
                          submitType === ISUBMITTYPE.APPROVE_PRINT
                        }
                        htmlType="submit"
                        size={'middle'}
                        type="primary"
                        onClick={() => {
                          setSubmitType(ISUBMITTYPE.APPROVE_PRINT);
                          AntForm.setFieldsValue({
                            status: {
                              status: 1,
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
                        disabled={creatingInvoice}
                        loading={
                          creatingInvoice &&
                          submitType === ISUBMITTYPE.ONLYAPPROVE
                        }
                        htmlType="submit"
                        size={'middle'}
                        type="primary"
                        onClick={() => {
                          setSubmitType(ISUBMITTYPE.ONLYAPPROVE);
                          AntForm.setFieldsValue({
                            status: {
                              status: 1,
                              print: false,
                            },
                          });
                        }}
                      >
                        Approve
                      </Button>
                    </>
                  </Rbac>
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

export const CreditNoteEditor: FC<IProps> = (props) => {
  return (
    <PurchaseManager {...props}>
      <Editor {...props} />
    </PurchaseManager>
  );
};
