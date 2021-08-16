/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingOutlined } from "@ant-design/icons";
import printIcon from "@iconify-icons/bytesize/print";
import Icon from "@iconify/react";
import { Button, Col, Modal, Row, Spin, Dropdown, Menu } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import React, { FC, useEffect, useRef, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  creditNoteViewAPI,
  getInvoiceByIDAPI,
  getPurchasesById,
  pushDraftToInvoiceAPI,
  pushDraftToPurchaseAPI,
} from "../../api";
import { getBanks } from "../../api/accounts";
import { getAllUsers } from "../../api/users";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import {
  Color,
  IErrorMessages,
  IServerError,
  NOTIFICATIONTYPE,
  PaymentMode,
} from "../../modal";
import { IAddress, IInvoiceItem, IInvoiceResult } from "../../modal/invoice";
import { IOrganizations } from "../../modal/organization";
import { ISupportedRoutes } from "../../modal/routing";
import { totalDiscountInInvoice } from "../../utils/formulas";
import moneyFormat from "../../utils/moneyFormat";
import printDiv, {
  ConvertDivToPDFAndDownload,
  DownloadPDF,
} from "../../utils/Print";
import { Heading } from "../Heading";
import CommonModal from "../Modal";
import { BoldText } from "../Para/BoldText";
import { P } from "../Para/P";
import { Payment } from "../Payment";
import { PrintFormat } from "../PrintFormat";
import { PrintViewPurchaseWidget } from "../PurchasesWidget/PrintViewPurchaseWidget";
import { Rbac } from "../Rbac";
import { PERMISSIONS } from "../Rbac/permissions";
import { useRbac } from "../Rbac/useRbac";
import { Seprator } from "../Seprator";
import { CommonTable } from "../Table";
import { TableCard } from "../TableCard";
import { Capitalize } from "../Typography";
import { EmailModal } from "./Email";

interface IProps {
  type: "SI" | "PO" | "credit-note";
  id?: number;
  onApprove?: (payload?: any) => void;
}

enum IInvoiceActions {
  APPROVE = "approve",
  CREDIT_NOTE = "credit_note",
  DOWNLOAD_PDF = "pdf_download",
  EMAIL = "email",
  CHANGE_DUE_DATE = "change_due_date",
  PROCEED = "proceed_po",
  PRINT = "print",
}
interface IPaymentPayload {
  paymentMode: number;
  dueDate: any;
  paymentType?: number;
  bankId?: number;
  amount?: number | any;
}

interface IInvoiceOptions {
  title: string;
  permission: string;
  key: string;
  icon?: any;
}
const defaultStates = {
  paymentMode: PaymentMode.CREDIT,
  dueDate: dayjs(),
  paymentType: null,
};

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

export const PurchasesView: FC<IProps> = ({ type, id, onApprove }) => {
  const [invId, setInvId] = useState(null);
  const { rbac } = useRbac(null);

  const [emailModal, setEmailModal] = useState(false);

  useEffect(() => {
    console.log("this is exeeding", id)
    if (id) {
      setInvId(id);
    }
  }, [id]);
  /* *************** HOOKS HERE ************** */
  /* API Stake */
  const APISTAKE = type === "SI" ? getInvoiceByIDAPI : type==="credit-note" ? creditNoteViewAPI : getPurchasesById;
  const APISTAKE_APPROVED =
    type === "PO" ? pushDraftToPurchaseAPI : pushDraftToInvoiceAPI;
  /* GLOBAL CONTEXT AREA */
  const { userDetails, notificationCallback, handleUploadPDF, routeHistory } =
    useGlobalContext();
  const { history } = routeHistory;
  const [tableData, setTableData] = useState<IInvoiceItem[]>([]);

  /* ************ QUERIES & MUTATIONS **************  */
  const { data, isLoading } = useQuery(
    [`invoice-view-${invId}`, invId],
    APISTAKE,
    {
      enabled: invId,
    }
  );

  const [mutateApprove, { isLoading: approving }] =
    useMutation(APISTAKE_APPROVED);

  /* ***************** STATES HERE ************ */

  const [paymentModal, setPaymentModal] = useState(false);
  const [payment, setPayment] = useState<IPaymentPayload>({ ...defaultStates });

  /* **************** STATES ENDS HERE ************** */
  let accessor = type === "SI" ? "invoice_items" : type==="credit-note" ? "credit_note_items" : "purchase_items";

  const response: IInvoiceResult =
    (data && data.data && data.data.result) || {};

    console.log(response)

  useEffect(() => {
    if (response) {
      setPayment({
        ...payment,
      });

      if (response && response[accessor]) {
        let sortedItems = response[accessor].sort((a, b) => {
          return a.sequence - b.sequence;
        });
        setTableData(sortedItems);
      }
    }
  }, [response]);

  /*Query hook for  Fetching all accounts against ID */
  // const allContactsRes = useQuery([`all-contacts`, "ALL"], getAllContacts);

  const allUsersRes = useQuery([`all-users`, "ALL"], getAllUsers);

  const allUsers =
    (allUsersRes.data &&
      allUsersRes.data.data &&
      allUsersRes.data.data.result) ||
    [];

  /* ************** QUERIES ENDS HERE ************** */

  /* Referance Print Div */

  const printRef = useRef();

  const findUserById = (id: number) => {
    if (allUsers.length) {
      const [users] = allUsers.filter((item) => item.id === id);
      return users;
    }
  };

  /* *************** COLUMNS DEFINITIONS ************** */
  const columns: ColumnsType<any> = [
    { title: "#", width: 30, render: (data, row, index) => <>{index + 1}</> },
    {
      title: "Item name",
      dataIndex: "item",
      key: "item",
      render: (data) => <>{data ? `${data.code} / ${data.name}` : "-"}</>,
    },
    { title: "Qty", width: 40, dataIndex: "quantity", key: "quantity" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (data, row, index) => <>{data ? data : "-"}</>,
    },
    {
      title: `${type === "SI" || type==="credit-note" ? "Unit Price" : "Purchase Price"}`,
      dataIndex: `${type === "SI" || type==="credit-note" ? "unitPrice" : "purchasePrice"}`,
      key: "unitPrice",
      render: (data) => <>{data ? moneyFormat(data) : "-"}</>,
    },
    {
      title: "Disc",
      dataIndex: "itemDiscount",
      key: "itemDiscount",
      render: (data) => <>{data ? data : "-"}</>,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (data) => <>{data ? data : "-"}</>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (data) => <>{data ? moneyFormat(data) : "-"}</>,
    },
  ];
  /* ****************** THIS WILL CALCULATE DISCOUNT *************** */
  const calculatedDisc: number = response && response.discount;
  /* ********* THIS IS RESPONSIBLE TO GET ITEMS DISCOUNT TOTAL ************ */
  const itemsDiscount =
    (response &&
      totalDiscountInInvoice(
        response[accessor],
        "itemDiscount",
        type === "PO" ? "POE" : "SI"
      )) ||
    0;

  const invoiceDiscount = calculatedDisc - itemsDiscount;
  const { data: bankData } = useQuery([`all-banks`], getBanks);
  const banksList = (bankData && bankData.data && bankData.data.result) || [];

  /* ************* THIS WILL CALCULATE TOTAL TAX ************* */
  const TotalTax =
    (response &&
      totalDiscountInInvoice(
       response[accessor],
        "tax",
        type === "PO" ? "POE" : "SI"
      )) ||
    0;

  const getPaidAmount = () => {
    let paid_amount = 0;
    if (response && response.paid_amount) {
      paid_amount = Math.abs(response.paid_amount);
    }
    return paid_amount;
  };

  const getRemainigAmount = () => {
    const { netTotal, paid_amount } = response;
    return typeof netTotal === "string"
      ? parseFloat(netTotal) - Math.abs(paid_amount)
      : netTotal - Math.abs(paid_amount);
  };
  const onPrint = () => {
    let PrintItem: HTMLElement = printRef.current;

    printDiv(PrintItem);
  };
  const onPDF = () => {
    let PrintItem: HTMLElement = printRef.current;

    ConvertDivToPDFAndDownload(PrintItem);
  };

  const checkStatus = () => {
    let itemStatus: any = <BoldText>Credit</BoldText>;
    if (response && response.paid_amount && response.payments.length) {
      const { paid_amount, netTotal } = response;
      let paidAmount = Math.abs(paid_amount);

      if (netTotal - paidAmount === netTotal) {
        itemStatus = `Credit`;
      } else if (netTotal === paidAmount) {
        itemStatus = `Full Payment`;
      } else if (netTotal > paidAmount) {
        itemStatus = "Partial Payment";
      }

    }
    return itemStatus;
  };

  const onEmail = (values) => {
    let printItem = printRef.current;

    let pdf = DownloadPDF(printItem);
    let payload = {
      ...values,
      html: `${pdf}`,
    };

    handleUploadPDF(payload);
  };

  const address: IAddress[] =
    (response && response.contact && response.contact.addresses) || [];
  const orgInfo: IOrganizations = userDetails.organization;

  const handleApprove = () => {
    let allItem = [
      ...response[accessor],
    ];
    const payload = {
      invoice: {
        ...response,
        status: 1,
      },
      payment: {
        ...payment,
        amount:
          payment.paymentMode === PaymentMode.CREDIT
            ? 0
            : payment.paymentMode === PaymentMode.CASH
            ? response.netTotal
            : parseFloat(payment.amount),
      },
      invoice_items: [...allItem],
    };
    delete payload.invoice.contact;
    delete payload.invoice.branchId;
    delete payload.invoice.createdAt;
    delete payload.invoice.updatedAt;
    delete payload.invoice.organizationId;
    delete payload.invoice.createdById;
    delete payload.invoice.updatedById;
    delete payload.invoice.isReturn;

    if (type === "PO") {
      delete payload.invoice.purchase_items;
    } else {
      delete payload.invoice.invoice_items;
    }

    mutateApprove(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, "Approved Successfully");
        setPayment({ ...defaultStates });
        setPaymentModal(false);
        [
          "invoices",
          "transactions",
          "items?page",
          "invoice-view",
          "ledger-contact",
        ].forEach((key) => {
          queryCache.invalidateQueries((q) =>
            q.queryKey[0].toString().startsWith(`${key}`)
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
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, message);
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            IErrorMessages.NETWORK_ERROR
          );
        }
      },
    });
  };

  const _heading =
    response && response.invoiceType === "SI"
      ? "Invoice"
      : response.invoiceType === "QO"
      ? "Quotation"
      : response.invoiceType === "PO"
      ? "Purchase Order"
      : response.invoiceType === "POE"
      ? "Purchase Entry "
      : "";

  function handleMenuClick(e) {
    switch (e?.key) {
      case IInvoiceActions?.APPROVE:
        setPaymentModal(true);
        break;
      case IInvoiceActions?.PROCEED:
        history.push(
          `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/${response.id}`
        );
        break;
      case IInvoiceActions?.DOWNLOAD_PDF:
        onPDF();
        break;
      case IInvoiceActions?.EMAIL:
        setEmailModal(true);
        break;
      case IInvoiceActions?.CHANGE_DUE_DATE:
        break;

      case IInvoiceActions?.CREDIT_NOTE:
        history?.push(`/app${ISupportedRoutes?.ADD_CREDIT_NOTE}/${id}`);
        break;
      case IInvoiceActions?.PRINT:
        onPrint();

        break;
    }
  }

  const _options: IInvoiceOptions[] = [
    response.invoiceType === "PO" && {
      title: "Approve",
      permission: PERMISSIONS?.PURCHASE_ORDERS_APPROVE,
      key: IInvoiceActions.APPROVE,
    },

    response.status === 2 &&
      response.invoiceType !== "QO" && {
        title: "Proceed",
        permission:
          type === "SI" || type==="credit-note"
            ? PERMISSIONS?.INVOICES_DRAFT_APPROVE
            : PERMISSIONS?.PURCHASES_DRAFT_APPROVE,
        key: IInvoiceActions.PROCEED,
      },
    {
      title: "Print",
      permission: null,
      key: IInvoiceActions.PRINT,
    },
    {
      title: "Add Credit note",
      permission: PERMISSIONS?.INVOICES_CREATE,
      key: IInvoiceActions.CREDIT_NOTE,
    },
    {
      title: "Download as PDF",
      permission: null,
      key: IInvoiceActions.DOWNLOAD_PDF,
    },
    {
      title: "Email",
      permission: null,
      key: IInvoiceActions.EMAIL,
    },
    {
      title: "Change Due Date",
      permission: PERMISSIONS?.INVOICES_CREATE,
      key: IInvoiceActions.CHANGE_DUE_DATE,
    },
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      {_options?.map((option, index) => {

        return rbac.can(option?.permission) || option?.permission === null ? (
          <Menu.Item key={option?.key}>{option?.title}</Menu.Item>
        ) : null;
      })}
    </Menu>
  );

  return (
    <>
      <div className="_visibleOnPrint" ref={printRef}>
        <PrintFormat>
          <PrintViewPurchaseWidget
            hideCalculation={response.invoiceType === "PO" ? true : false}
            type={type}
            data={response}
          />
        </PrintFormat>
      </div>
      <WrapperInvoiceView className="_disable_print ">
        {isLoading ? (
          <div className="flex alignCenter justifyCenter loading-wrapper">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <div className="_card_wrapper">
            <Row gutter={24} className="print_margin_reset">
              <Col className="print_margin_reset" span={22} offset={1}>
                <div className="pv-20 flex alignCenter justifySpaceBetween">
                  <Heading>
                    {_heading}({response && response.invoiceNumber})
                  </Heading>
                  <div className="flex alignCenter _disable_print">
                    <Dropdown overlay={menu}>
                      <Button type="primary">Invoice Options</Button>
                    </Dropdown>
                  </div>
                </div>
              </Col>
              <Col span={22} offset={1}>
                <TableCard>
                  <Row gutter={24}>
                    <Col className="print_item print_margin_reset" span={24}>
                      <Row className="print_margin_reset" gutter={24}>
                        <Col
                          className="print_margin_reset"
                          span={22}
                          offset={1}
                        >
                          <Row className="print_margin_reset" gutter={24}>
                            <Col
                              className="print_margin_reset"
                              span={5}
                              order={type === "SI" || type==="credit-note" ? 1 : 2}
                            >
                              <div className="invoice_to">
                                <BoldText className="mt-8">To</BoldText>
                                {type === "SI" || type==="credit-note" ? (
                                  <Link
                                    className="mt-8"
                                    to={`/app${ISupportedRoutes.CONTACTS}/${
                                      response && response.contactId
                                    }`}
                                  >
                                   <Capitalize> {
                                      response?.contact?.name}</Capitalize>
                                  </Link>
                                ) : (
                                  <P>{userDetails.organization.name}</P>
                                )}
                                <P className="mt-8">
                                  {type === "SI" || type==="credit-note"
                                    ? 
                                      response?.contact?.addresses?.length &&
                                      response?.contact?.addresses[0]?.description
                                    : userDetails &&
                                      orgInfo &&
                                      orgInfo.residentialAddress}
                                </P>
                                <P className="mt-8">
                                  {(type === "SI" || type==="credit-note" &&
                                    response?.contact?.addressId &&
                                    response?.contact?.addresses[0]?.city) ||
                                    ""}
                                </P>
                              </div>
                            </Col>
                            <Col span={5} order={type === "SI" || type==="credit-note" ? 2 : 1}>
                              <div className="invoice_to">
                                <BoldText className="mt-8">From</BoldText>
                                {type === "SI" || type==="credit-note" ? (
                                  <P className="mt-8">
                                    {
                                     response?.user?.username} ({response?.organization?.name})
                                  </P>
                                ) : (
                                  <Link
                                    to={`/app${ISupportedRoutes.CONTACTS}/${
                                      (response && response.contactId) || null
                                    }`}
                                  >
                                    <Capitalize>{
                                      `${response?.contact?.name} (${response?.contact?.businessName})`}</Capitalize>
                                  </Link>
                                )}
                                <P className="mt-8">
                                  {type === "PO"
                                    ? address &&
                                      address.length > 0 &&
                                      address[0].description
                                    : ""}
                                </P>
                                <P className="mt-8">
                                  {type === "PO"
                                    ? address &&
                                      address.length > 0 &&
                                      address[0].city
                                    : ""}
                                </P>
                              </div>
                            </Col>
                            <Col span={7} offset={7} order={3}>
                              {response &&
                                response.invoiceType !== "QO" &&
                                response.invoiceType !== "PO" && response?.invoiceType && (
                                  <div className="flex alignCenter justifySpaceBetween mt-8">
                                    <BoldText>Status:</BoldText>
                                    <P>{response && checkStatus()}</P>
                                  </div>
                                )}
                              <div className="flex alignCenter justifySpaceBetween mt-8">
                                <BoldText>Date:</BoldText>
                                <P>
                                  {response &&
                                    dayjs(response.issueDate).format(
                                      "MM/DD/YYYY"
                                    )}
                                </P>
                              </div>
                              {response?.payments?.length > 0 ||
                                (response?.dueDate && (
                                  <div className="flex alignCenter justifySpaceBetween mt-8">
                                    <BoldText>Delivery Date:</BoldText>
                                    <P>
                                      {dayjs(
                                        response.invoiceType === "PO" ||
                                          response.invoiceType === "QO"
                                          ? response?.dueDate
                                          : response?.payments[0]?.dueDate
                                      ).format("MM/DD/YYYY")}
                                    </P>
                                  </div>
                                ))}
                              <div className="flex alignCenter justifySpaceBetween mt-8">
                                <BoldText>Refference # :</BoldText>
                                <P>{response && response.reference}</P>
                              </div>
                            </Col>
                          </Row>

                          <div className="table-wrapper print-mv-40">
                            <CommonTable
                              loading={isLoading}
                              bordered
                              pagination={false}
                              size={"small"}
                              columns={columns}
                              data={tableData}
                            />
                          </div>
                        </Col>
                        <Col span={22} offset={1}>
                          <Row gutter={24} className="print_view_row">
                            <Col
                              span={10}
                              offset={2}
                              pull={2}
                              // md={{ span: 10, offset: 2, pull: 2 }}
                              // lg={{ span: 10, offset: 2, pull: 2 }}
                              // xxl={{ span: 6, offset: 6, pull: 6 }}
                            >
                              {response && response.comment && (
                                <div className="mt-35">
                                  <BoldText className="mt-10">Note: </BoldText>
                                  <div className="_special_comment">
                                    <P>{response && response.comment}</P>
                                  </div>
                                </div>
                              )}
                              {response &&
                                response.payments &&
                                Array.isArray(response.payments) &&
                                response.payments.length > 0 && (
                                  <div className="payment_details_card mt-35">
                                    <div className="flex alignStart pv-2 ">
                                      <BoldText className="bold_text">
                                        Status
                                      </BoldText>
                                      <P className="plain_text">
                                        {checkStatus()}
                                      </P>
                                    </div>
                                    <div className="flex alignStart pv-2 ">
                                      <BoldText className="bold_text">
                                        Paid Amount
                                      </BoldText>
                                      <P className="plain_text">
                                        {moneyFormat(getPaidAmount())}
                                      </P>
                                    </div>
                                    <div className="flex alignStart pv-2 ">
                                      <BoldText className="bold_text">
                                        Remaining Amount
                                      </BoldText>
                                      <P className="plain_text">
                                        {moneyFormat(getRemainigAmount())}
                                      </P>
                                    </div>
                                  </div>
                                )}
                            </Col>
                            {response && response.invoiceType !== "PO" && (
                              <Col span={8} offset={4}>
                                <div className="mt-35">
                                  <div className="flex alignCenter justifySpaceBetween mv-5">
                                    <BoldText>Sub Total</BoldText>
                                    <P>
                                      {response &&
                                        moneyFormat(response.grossTotal)}
                                    </P>
                                  </div>
                                  <div className="flex alignCenter justifySpaceBetween mv-5">
                                    <BoldText>Items Discount</BoldText>
                                    <P>
                                      {response && moneyFormat(itemsDiscount)}
                                    </P>
                                  </div>
                                  <div className="flex alignCenter justifySpaceBetween mv-5">
                                    <BoldText>Invoice Discount</BoldText>
                                    <P>
                                      {response && moneyFormat(invoiceDiscount)}
                                    </P>
                                  </div>
                                  <div className="flex alignCenter justifySpaceBetween mv-5">
                                    <BoldText>Tax</BoldText>
                                    <P>{response && moneyFormat(TotalTax)}</P>
                                  </div>
                                  <Seprator />
                                  <div className="flex alignCenter justifySpaceBetween mv-5">
                                    <BoldText>Total</BoldText>
                                    <BoldText>
                                      {response &&
                                        moneyFormat(response.netTotal)}
                                    </BoldText>
                                  </div>
                                  <Seprator />
                                </div>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </TableCard>
              </Col>
            </Row>
          </div>
        )}
        <CommonModal
          footer={false}
          onCancel={() => setPaymentModal(false)}
          visible={paymentModal}
        >
          <Payment
            initialValues={{
              ...payment,
              totalAmount: response && response.netTotal,
              totalDiscount: response && response.discount,
            }}
            reset={false}
            onChange={(payload) => setPayment(payload)}
          />
          <div className="mv-10 pb-10 textRight">
            <Button
              className="mr-10"
              type="primary"
              ghost
              size="middle"
              onClick={() => {
                setPaymentModal(false);
                setPayment({ ...defaultStates });
              }}
            >
              Cancel
            </Button>
            <Button
              loading={approving}
              onClick={handleApprove}
              type="primary"
              size="middle"
            >
              Payment Proceed
            </Button>
          </div>
        </CommonModal>
        <EmailModal
          onSendEmail={onEmail}
          visibility={emailModal}
          setVisibility={(a) => setEmailModal(a)}
        />
      </WrapperInvoiceView>
    </>
  );
};

const WrapperInvoiceView = styled.div`
  .loading-wrapper {
    min-height: 71vh;
  }
  ._card_wrapper {
    min-height: 71vh;
  }
  h4,
  p {
    margin: 0;
  }
  .invoice-detail {
    margin-top: 5px;
    h4 {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: #3e3e3c;
    }
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.08em;
      text-transform: capitalize;

      color: #414141;
    }
    h4,
    p {
      flex: 1;
    }
  }

  .info_heading {
    background: #f1f1f1;
    border-radius: 4px;
    padding: 6px 16px;
    margin-top: 65px;
  }

  .user_details {
    margin-top: 16px;
    .user-name {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.08em;
      text-transform: capitalize;
      color: #222222;
      padding: 6px 0;
    }
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.08em;
      text-transform: capitalize;
      color: #222222;
    }
  }

  .table-wrapper {
    margin-top: 38px;
  }

  .payment_details_card {
    border: 1px solid #e3e3e3;
    padding: 18px 22px;

    .bold_text {
      flex: 2;
    }

    .plain_text {
      flex: 1;
    }
  }

  .custom_grid_col {
    margin-top: 20px;
  }
  ._special_comment {
    border: 1px solid #efefef;
    padding: 8px 10px;
    min-height: 70px;
    width: 100%;
    border-radius: 5px;
  }

  /* @media print {
    .print_margin_reset {
      padding: 0 !important;
      margin: 0 !important;
    }
  } */

  .table-wrapper {
    .ant-table-content {
      max-height: 600px;
    }
    table {
      text-align: left;
      position: relative;
      border-collapse: collapse;
    }

    thead tr th {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  }
`;
