/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { EditableTable } from '@invyce/editable-table';
import { Button, Card, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { FC, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';

import { getAllContacts, getInvoiceNumber } from '../../../../../api';
import { CreatePurchaseOrderAPI } from '../../../../../api/purchaseOrder';
import { ConfirmModal } from '../../../../../components/ConfirmModal';
import { DatePicker } from '../../../../../components/DatePicker';
import { FormLabel } from '../../../../../components/FormLabel';
import { PrintFormat } from '../../../../../components/PrintFormat';
import { PrintViewPurchaseWidget } from '../../../../../components/PurchasesWidget/PrintViewPurchaseWidget';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import {
  IContactType,
  IContactTypes,
  IInvoiceTypes,
  NOTIFICATIONTYPE,
} from '../../../../../modal';
import { ISupportedRoutes } from '../../../../../modal/routing';
import printDiv, { DownloadPDF } from '../../../../../utils/Print';
import {
  PurchaseOrderWidgetManager,
  usePurchaseOrderContext,
} from './PurchaseOrderWidgetManager';
import { WrapperPurchaseOrderForm } from './styles';
import bxPlus from '@iconify-icons/bx/bx-plus';
import Icon from '@iconify/react';

const { Option } = Select;
interface IProps {
  id?: number | string;
}

const Editor: FC<IProps> = ({ id }) => {
  const queryCache = useQueryClient();
  /* LOCAL STATE */
  const [printModal, setPrintModal] = useState(false);
  const [status, setStatus] = useState(1);

  /* ******** API CALL STAKE ************ */
  const {
    mutate: mutatePO,
    isLoading: creatingPurchaseOrder,
    data: responseCreatedPO,
  } = useMutation(CreatePurchaseOrderAPI);
  const [contactList, setContactList] = useState<IContactType[]>([]);

  /*Query hook for  Fetching all accounts against ID */
  const { isLoading: allContactsLoading, data: contactsData } = useQuery(
    [`all-contacts`, 'ALL'],
    getAllContacts,
    {
      cacheTime: Infinity,
    }
  );

  /* ********* API CALL STAKE ENDS HERE *******/

  /* GLOBAL CONTEXT (GLOBAL STATE) */
  const { notificationCallback, handleUploadPDF, userDetails } =
    useGlobalContext();
  const history = useHistory();

  /* WIDGET CONTEXT */
  const { state, setState, columns, reset, loading, addRow, antForm } =
    usePurchaseOrderContext();

  useEffect(() => {
    if (contactsData && contactsData.data && contactsData.data.result) {
      const { result } = contactsData.data;
      const filtered = result.filter(
        (contact) => contact.contactType === IContactTypes.SUPPLIER
      );
      setContactList(filtered);
    }
  }, [contactsData]);

  const Printref = useRef();

  const { data: invoiceNumberData } = useQuery(
    ['', IInvoiceTypes.PURCHASE_ORDER],
    getInvoiceNumber
  );

  useEffect(() => {
    if (invoiceNumberData?.data?.result) {
      const { result } = invoiceNumberData?.data;
      antForm.setFieldsValue({ invoiceNumber: result });
    }
  }, [invoiceNumberData, antForm]);

  /* Scroll to last added item */

  const ClearAll = () => {
    antForm.resetFields();
    antForm.setFieldsValue({ issueDate: dayjs(), dueDate: dayjs() });
    reset();
    history.push(
      `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.CREATE_PURCHASE_ORDER}`
    );
  };

  const onCancelPrint = () => {
    setPrintModal(false);

    if (id) {
      queryCache.removeQueries(`PO-view-${id}`);
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

  const onPrint = () => {
    const printItem = Printref.current;
    printDiv(printItem);
  };

  const onSendPDF = (contactId, message) => {
    const printItem = Printref.current;
    let email = ``;

    const [filteredContact] =
      contactList && contactList.filter((cont) => cont.id === contactId);

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

  useEffect(() => {
    antForm.setFieldsValue({ issueDate: dayjs(), dueDate: dayjs() });
  }, []);

  const onFinish = async (value) => {
    const invId = id && typeof id === 'string' ? parseInt(id) : id;

    let payload = {
      ...value,
      status: value?.status?.status,
      invoiceType: 'PO',
      isNewRecord: true,

      invoice_items: state.map((item, index) => {
        if (id) {
          delete item.item;
        }
        return { ...item, sequence: index };
      }),
    };
    if (id) {
      payload = {
        ...payload,
        id: invId,
        isNewRecord: false,
      };
    }

    try {
      await mutatePO(payload, {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Purchase Order ${payload.status === 1 ? 'Created' : 'Saved'}`
          );
          if (value.email_pdf) {
            const message = `Purchase Order From ${userDetails?.organization?.name}, Branch ${userDetails?.branch?.name} \n Reference: ${value.referance}`;

            onSendPDF(value.contactId, message);
          }
          setState([
            {
              itemId: null,
              quantity: 0,
              description: '',
              index: 0,
            },
          ]);
          [
            'invoices',
            'transactions?page',
            'items-list',
            'invoice-view',
            'ledger-contact',
            'all-items',
            `purchase-order-${id}`,
          ].forEach((key) => {
            (queryCache.invalidateQueries as any)((q) => q?.startsWith(key));
          });
          if (value?.status?.type === 2) {
            setPrintModal(true);
          }
          antForm.resetFields();
          antForm.setFieldsValue({ issueDate: dayjs(), dueDate: dayjs() });
          ClearAll();
        },
      });
    } catch (error) {
      notificationCallback(NOTIFICATIONTYPE.ERROR, 'Purchase Order Failed ');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <WrapperPurchaseOrderForm>
      <div ref={Printref} className="_visibleOnPrint">
        <PrintFormat>
          <PrintViewPurchaseWidget
            heading={'Purchase Order'}
            type={'PO'}
            hideCalculation={true}
            data={
              {
                ...responseCreatedPO?.data?.result,
                invoiceItems:
                  responseCreatedPO?.data?.result?.purchaseOrderItems,
              } || {}
            }
          />
        </PrintFormat>
      </div>
      <Card>
        <Row gutter={4}>
          <Col span={24}>
            <Form
              form={antForm}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <div className="ref_header">
                <Row gutter={24}>
                  <Col span={5} className="custom_col">
                    <FormLabel>Vendor</FormLabel>
                    <Form.Item
                      name="contactId"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <Select
                        loading={allContactsLoading}
                        size="middle"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Contact"
                        optionFilterProp="children"
                      >
                        {contactList.map((contact, index) => {
                          return (
                            <Option key={index} value={contact.id}>
                              {contact.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4} className="custom_col">
                    <FormLabel>Issue Date</FormLabel>
                    <Form.Item
                      name="issueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
                        onChange={(val) =>
                          antForm.setFieldsValue({
                            dueDate: val,
                          })
                        }
                        style={{ width: '100%' }}
                        size="middle"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4} className="custom_col">
                    <FormLabel>Delivery Date</FormLabel>
                    <Form.Item
                      name="dueDate"
                      rules={[{ required: true, message: 'Required !' }]}
                    >
                      <DatePicker
                        disabledDate={(current) => {
                          return (
                            current &&
                            current < dayjs(antForm.getFieldValue('issueDate'))
                          );
                        }}
                        style={{ width: '100%' }}
                        size="middle"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3} className="custom_col">
                    <FormLabel>Order Number</FormLabel>
                    <Form.Item
                      name="invoiceNumber"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Input disabled={true} size="middle" />
                    </Form.Item>
                  </Col>
                  <Col span={4} className="custom_col">
                    <FormLabel>Reference</FormLabel>
                    <Form.Item
                      name="reference"
                      rules={[{ required: false, message: 'Required !' }]}
                    >
                      <Input size="middle" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={4} className="custom_col">
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
                          return <Option value={curr}>{curr}</Option>;
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className="table mt-15">
                  <EditableTable
                    loading={loading}
                    dragable={(data) => setState(data)}
                    columns={columns}
                    data={state}
                    scrollable={{ offsetY: 400, offsetX: 0 }}
                  />
                </div>
                <div className="add_purcahseitem  pv-20">
                  <Button
                    className="flex alignCenter"
                    onClick={addRow}
                    type="primary"
                    ghost
                  >
                    <span className="flex alignCenter mr-10">
                      <Icon icon={bxPlus} />
                    </span>
                    Add new purchase item
                  </Button>
                </div>
              </div>
              <Col span={12}>
                <div className="pv-10">
                  <FormLabel>Comment or special instructions</FormLabel>
                  <Form.Item name="comment">
                    <TextArea rows={4} />
                  </Form.Item>
                </div>
              </Col>
              <div className="mt-10 actions textRight flex alignCenter justifyFlexEnd ">
                {/* <Form.Item
                  className="mr-10"
                  name="email_pdf"
                  valuePropName="checked"
                >
                  <Checkbox>Send to Email</Checkbox>
                </Form.Item> */}
                <Form.Item name="status">
                  <Button
                    disabled={creatingPurchaseOrder}
                    onClick={() => {
                      antForm.setFieldsValue({
                        status: {
                          status: 2,
                          type: 1,
                        },
                      });
                      setStatus(2);
                    }}
                    loading={creatingPurchaseOrder}
                    type="default"
                    size="middle"
                    className="mr-10"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                  <Button
                    disabled={creatingPurchaseOrder}
                    onClick={() => {
                      antForm.setFieldsValue({
                        status: {
                          status: 2,
                          type: 2,
                        },
                      });
                      setStatus(2);
                    }}
                    loading={creatingPurchaseOrder}
                    type="primary"
                    size="middle"
                    className="mr-10"
                    htmlType="submit"
                  >
                    Save & Print
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
      <ConfirmModal
        visible={printModal}
        onCancel={onCancelPrint}
        onConfirm={onPrint}
        type="info"
        text="Do you want to print?"
      />
    </WrapperPurchaseOrderForm>
  );
};

export const PurchaseOrderForm: FC<IProps> = ({ id }) => {
  return (
    <PurchaseOrderWidgetManager id={id}>
      <Editor id={id} />
    </PurchaseOrderWidgetManager>
  );
};
