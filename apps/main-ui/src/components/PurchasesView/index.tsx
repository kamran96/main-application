import { Card, Col, Row, Button, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '../Heading';
import { PrintHeaderFormat } from '../PrintHeader';
import { TableDivisions } from '../PrintHeader';
import { TopbarLogoWithDetails, Addressbar } from '../PrintHeader/Formats';
import { Seprator } from '../Seprator';
import { BoldText, BOLDTEXT } from '../Para/BoldText';
import { Capitalize, H3, P } from '../Typography';
import moneyFormat from '../../utils/moneyFormat';
import { CommonTable } from '../Table';
import { ColumnsType } from 'antd/lib/table';
import { useRbac } from '../Rbac/useRbac';
import {
  creditNoteViewAPI,
  getInvoiceByIDAPI,
  getPurchasesById,
  pushDraftToInvoiceAPI,
  pushDraftToPurchaseAPI,
} from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IAddress, IInvoiceItem, IInvoiceResult } from '../../modal';
import { queryCache, useMutation, useQuery } from 'react-query';
import {
  IErrorMessages,
  IServerError,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  PaymentMode,
} from '../../modal';
import dayjs from 'dayjs';
import { getAllUsers } from '../../api/users';
import { useRef } from 'react';
import { PERMISSIONS } from '../Rbac/permissions';
import printDiv, {
  ConvertDivToPDFAndDownload,
  DownloadPDF,
} from '../../utils/Print';
import { Link } from 'react-router-dom';
import CommonModal from '../Modal';
import { EmailModal } from './Email';
import { Payment } from '../Payment';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { PrintFormat } from '../PrintFormat';
import { PrintViewPurchaseWidget } from '../PurchasesWidget/PrintViewPurchaseWidget';
import { totalDiscountInInvoice } from '../../utils/formulas';
import { getBanks } from '../../api/accounts';
interface IProps {
  type?: 'SI' | 'PO' | 'credit-note';
  id?: number;
  onApprove?: (payload?: any) => void;
}

enum IInvoiceActions {
  APPROVE = 'approve',
  CREDIT_NOTE = 'credit_note',
  DOWNLOAD_PDF = 'pdf_download',
  EMAIL = 'email',
  CHANGE_DUE_DATE = 'change_due_date',
  PROCEED = 'proceed_po',
  PRINT = 'print',
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

export const PurchasesView: FC<IProps> = ({ id, type = 'SI', onApprove }) => {
  /* ******API STAKE******* */
  const APISTAKE =
    type === 'SI'
      ? getInvoiceByIDAPI
      : type === 'credit-note'
      ? creditNoteViewAPI
      : getPurchasesById;
  const APISTAKE_APPROVED =
    type === 'PO' ? pushDraftToPurchaseAPI : pushDraftToInvoiceAPI;
  /* ******API STAKE ENDS HERE******* */

  const accessor =
    type === 'SI'
      ? 'invoiceItems'
      : type === 'credit-note'
      ? 'credit_note_items'
      : 'purchaseItems';

  /* *************** HOOKS HERE ************** */

  /* **************UTILITY HOOKS**************** */
  const { rbac } = useRbac(null);
  const { userDetails, notificationCallback, handleUploadPDF, routeHistory } =
    useGlobalContext();
  const { history } = routeHistory;
  /* ************ QUERIES & MUTATIONS **************  */
  const { data, isLoading } = useQuery([`invoice-view-${id}`, id], APISTAKE, {
    enabled: id,
  });

  const response: IInvoiceResult =
    (data && data.data && data.data.result) || {};

  const address: IAddress[] =
    (response && response.contact && response.contact.addresses) || [];
  const orgInfo = userDetails.organization;

  const [mutateApprove, { isLoading: approving }] =
    useMutation(APISTAKE_APPROVED);

  /*Query hook for  Fetching all accounts against ID */
  // const allContactsRes = useQuery([`all-contacts`, "ALL"], getAllContacts);

  /* ************** QUERIES ENDS HERE ************** */

  /* **************UTILITY HOOKS ENDS HERE**************** */

  /* LOCAL STATES */
  const [emailModal, setEmailModal] = useState(false);
  const [tableData, setTableData] = useState<IInvoiceItem[]>([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [payment, setPayment] = useState<IPaymentPayload>({ ...defaultStates });
  /* LOCAL STATES ENDS HERE */

  /* ***** COMPONENT LIFE CYCLES */

  useEffect(() => {
    if (response) {
      setPayment({
        ...payment,
      });

      if (response && response[accessor]) {
        const sortedItems = response[accessor].sort((a, b) => {
          return a.sequence - b.sequence;
        });
        setTableData(sortedItems);
      }
    }
  }, [response]);

  /* ***** COMPONENT LIFE CYCLES */

  /* Referance Print Div */

  const printRef = useRef();

  /*  COMPONENT UTILITY FUNCTIONS */

  const onPrint = () => {
    const PrintItem: HTMLElement = printRef.current;

    printDiv(PrintItem);
  };
  const onPDF = () => {
    const PrintItem: HTMLElement = printRef.current;

    ConvertDivToPDFAndDownload(PrintItem);
  };
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

  const handleApprove = () => {
    const allItem = [...response[accessor]];
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

    if (type === 'PO') {
      delete payload.invoice.purchase_items;
    } else {
      delete payload.invoice.invoice_items;
    }

    mutateApprove(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Approved Successfully');
        setPayment({ ...defaultStates });
        setPaymentModal(false);
        [
          'invoices',
          'transactions',
          'items?page',
          'invoice-view',
          'ledger-contact',
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

  const onEmail = (values) => {
    const printItem = printRef.current;

    const pdf = DownloadPDF(printItem);
    const payload = {
      ...values,
      id,
      type,
      html: `${pdf}`,
    };

    handleUploadPDF(payload);
  };

  /* *********************CALCULATIONS**************** */
  /* ****************** THIS WILL CALCULATE DISCOUNT *************** */
  const calculatedDisc: number = response && response.discount;
  /* ********* THIS IS RESPONSIBLE TO GET ITEMS DISCOUNT TOTAL ************ */
  const itemsDiscount =
    (response &&
      totalDiscountInInvoice(
        response[accessor],
        'itemDiscount',
        type === 'PO' ? 'POE' : 'SI'
      )) ||
    0;

  const invoiceDiscount = calculatedDisc - itemsDiscount;

  /* ************* THIS WILL CALCULATE TOTAL TAX ************* */
  const TotalTax =
    (response &&
      totalDiscountInInvoice(
        response[accessor],
        'tax',
        type === 'PO' ? 'POE' : 'SI'
      )) ||
    0;

  const getRemainigAmount = () => {
    const { netTotal, paid_amount } = response;
    return typeof netTotal === 'string'
      ? parseFloat(netTotal) - Math.abs(paid_amount)
      : netTotal - Math.abs(paid_amount);
  };

  /* *********************CALCULATIONS ENDS HERE**************** */
  const columns: ColumnsType = [
    {
      title: 'DESCRIPTION',
      dataIndex: 'item',
      key: 'item',
      render: (data: any, row: IInvoiceItem, index: number) => {
        return (
          <>
            <BOLDTEXT> {data ? data?.name : '-'}</BOLDTEXT> <br />
            <div className="mt-10">{row ? row?.description : '-'}</div>
          </>
        );
      },
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'RATE',
      dataIndex: type === 'PO' ? `purchasePrice` : `unitPrice`,
      key: type === 'PO' ? `purchasePrice` : `unitPrice`,
    },
    {
      title: 'DISCOUNT',
      dataIndex: 'itemDiscount',
      key: 'itemDiscount',
    },
    {
      title: 'TAX',
      dataIndex: 'tax',
      key: 'tax',
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const _options: IInvoiceOptions[] = [
    response.invoiceType === 'PO' && {
      title: 'Approve',
      permission: PERMISSIONS?.PURCHASE_ORDERS_APPROVE,
      key: IInvoiceActions.APPROVE,
    },

    response.status === 2 &&
      response.invoiceType !== 'QO' && {
        title: 'Proceed',
        permission:
          type === 'SI' || type === 'credit-note'
            ? PERMISSIONS?.INVOICES_DRAFT_APPROVE
            : PERMISSIONS?.PURCHASES_DRAFT_APPROVE,
        key: IInvoiceActions.PROCEED,
      },
    {
      title: 'Print',
      permission: null,
      key: IInvoiceActions.PRINT,
    },
    {
      title: 'Add Credit note',
      permission: PERMISSIONS?.INVOICES_CREATE,
      key: IInvoiceActions.CREDIT_NOTE,
    },
    {
      title: 'Download as PDF',
      permission: null,
      key: IInvoiceActions.DOWNLOAD_PDF,
    },
    {
      title: 'Email',
      permission: null,
      key: IInvoiceActions.EMAIL,
    },
    {
      title: 'Change Due Date',
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
    <WrapperNewPurchaseView>
      <div className="pv-10">
        <Row gutter={24}>
          <Col span={12}>
            <Heading type="container">
              {' '}
              {type === 'SI'
                ? 'Invoice'
                : type === 'PO'
                ? 'Bill'
                : 'Credit Note'}{' '}
              {response?.invoiceNumber ? `(${response?.invoiceNumber})` : null}
            </Heading>
          </Col>
          <Col span={12}>
            <div className="textRight">
              <Dropdown overlay={menu}>
                <Button type="primary">
                  {type === 'SI'
                    ? 'Invoice'
                    : type === 'PO'
                    ? 'Bill'
                    : 'Credit Note'}{' '}
                  Options
                </Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>

      <Card loading={isLoading}>
        <div className="invoice_topbar">
          <PrintHeaderFormat hasbackgroundColor={false}>
            <TableDivisions
              divisions={[
                {
                  element: <TopbarLogoWithDetails />,
                },
                {
                  element: <Addressbar />,
                },
              ]}
            />
          </PrintHeaderFormat>
          <Seprator />
        </div>
        <div className="info-area">
          <table>
            <tbody>
              <tr className="row">
                <td className="sent_to">
                  <table>
                    <tr>
                      <td className="head">To,</td>
                    </tr>
                    <tr>
                      <td>
                        {type === 'SI' || type === 'credit-note' ? (
                          <Link
                            className="mt-8"
                            to={`/app${ISupportedRoutes.CONTACTS}/${
                              response && response.contactId
                            }`}
                          >
                            <Capitalize> {response?.contact?.name}</Capitalize>
                          </Link>
                        ) : (
                          <P>{userDetails.organization.name}</P>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {/* {type === 'SI' || type === 'credit-note'
                          ? response?.contact?.addresses?.length &&
                            response?.contact?.addresses[0]?.description
                          : userDetails &&
                            orgInfo &&
                            orgInfo.residentialAddress} */}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {type === 'SI' ||
                          (type === 'credit-note' &&
                            response?.contact?.addressId &&
                            response?.contact?.addresses[0]?.city) ||
                          ''}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {type === 'SI' ||
                          (type === 'credit-note' &&
                            response?.contact?.addressId &&
                            response?.contact?.addresses[0]?.city) ||
                          ''}
                      </td>
                    </tr>
                  </table>
                </td>
                <td className="invoice_reference">
                  <table>
                    <tr>
                      <td className="head">Invoice number</td>
                    </tr>
                    <tr>
                      <td>
                        <BoldText>
                          <Capitalize>{response?.invoiceNumber}</Capitalize>
                        </BoldText>
                      </td>
                    </tr>
                    <tr>
                      <td className="head">Reference</td>
                    </tr>
                    <tr>
                      <td>
                        <BoldText>
                          <Capitalize>{response?.reference}</Capitalize>
                        </BoldText>
                      </td>
                    </tr>
                    <tr>
                      <td className="head">Invoice Date</td>
                    </tr>
                    <tr>
                      <td>
                        <BoldText>
                          <Capitalize>
                            {dayjs(response?.issueDate).format('MM/DD/YYYY')}
                          </Capitalize>
                        </BoldText>
                      </td>
                    </tr>
                  </table>
                </td>
                <td className="invoice_amount">
                  <table>
                    <tr>
                      <td className="head">Invoice of (USD)</td>
                    </tr>
                    <tr>
                      <td>
                        <H3 className="amount">
                          <BOLDTEXT>
                            <Capitalize>
                              {moneyFormat(response?.netTotal)}
                            </Capitalize>
                          </BOLDTEXT>
                        </H3>
                      </td>
                    </tr>
                    <tr>
                      <td className="head">Due Date</td>
                    </tr>
                    <tr>
                      <td>
                        <BoldText>
                          <Capitalize>
                            {dayjs(response?.dueDate).format('MM/DD/YYYY')}
                          </Capitalize>
                        </BoldText>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Seprator />
        <div className="table_data">
          <CommonTable
            loading={isLoading}
            data={tableData}
            columns={columns}
            pagination={false}
            size="small"
          />
        </div>
        <Seprator />
        <Row gutter={24}>
          <Col span={8} offset={10} pull={10}>
            <div className="payment_details_card mt-35">
              <div className="flex alignStart pv-2 ">
                <BoldText className="bold_text">Status</BoldText>
                <P className="plain_text">{response?.payment_status}</P>
              </div>
              <div className="flex alignStart pv-2 ">
                <BoldText className="bold_text">Paid Amount</BoldText>
                <P className="plain_text">
                  {moneyFormat(response?.paid_amount)}
                </P>
              </div>
              <div className="flex alignStart pv-2 ">
                <BoldText className="bold_text">Remaining Amount</BoldText>
                <P className="plain_text">
                  {moneyFormat(response?.due_amount)}
                </P>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="calculation textRight">
              <table>
                <tr>
                  <th>Sub Total</th>
                  <td>{moneyFormat(response?.grossTotal)}</td>
                </tr>
                <tr>
                  <th>Items Discount</th>
                  <td>{response && moneyFormat(itemsDiscount)}</td>
                </tr>
                <tr>
                  <th>Invoice Discount</th>
                  <td>{response && moneyFormat(invoiceDiscount)}</td>
                </tr>
                <tr>
                  <th>Tax Rate</th>
                  <td>{response && moneyFormat(TotalTax)}</td>
                </tr>

                <tr>
                  <th>Total</th>
                  <td>{moneyFormat(response?.netTotal)}</td>
                </tr>
              </table>
            </div>
          </Col>
          {true&& (
            <Col span={10}>
              <div className="notes">
                <h5 className="label">
                  <BOLDTEXT>Notes</BOLDTEXT>
                </h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris aliquam pulvinar dolor urna enim vitae vel. Ultrices
                  eget ut.
                </p>
              </div>
            </Col>
          )}
          <Col span={14}>
            <div className="notes">
              <h5 className="label">
                <BOLDTEXT>Terms & Conditions</BOLDTEXT>
              </h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec id
                turpis malesuada nibh. Faucibus vitae, blandit aliquet
                scelerisque faucibus magna volutpat. Vitae aliquet maecenas
                purus sem. Egestas pellentesque varius elit quisque placerat
                integer elit sed senectus.
              </p>
            </div>
          </Col>
        </Row>
      </Card>
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

      <div className="_visibleOnPrint" ref={printRef}>
        <PrintFormat>
          <PrintViewPurchaseWidget
            hideCalculation={response.invoiceType === 'PO' ? true : false}
            type={type}
            data={response}
          />
        </PrintFormat>
      </div>
    </WrapperNewPurchaseView>
  );
};

const WrapperNewPurchaseView = styled.div`
  /* Print Header styles */
  padding: 0 188px;
  /* Used For all prints */
  .print_header_area .header_company_logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
  }

  .print_header_area {
    padding: 30px;
  }
  .print_header_area.hasbg {
    background: #f7fbff;
    padding: 30px;
  }
  /* Used For all prints ends here */

  /* ************* TOPBAR WITH LOGO DETAILS styles ********************** */
  .topbar_logo_details_wrapper .logo {
    display: flex;
    align-items: flex-start;
  }
  .topbar_logo_details_wrapper .company_details {
    padding: 0px 22px;
  }
  .topbar_logo_details_wrapper .company_details .company_name {
    color: ${(props: IThemeProps) => props?.theme?.theme === 'dark' ? props?.theme?.colors?.$BLACK : props?.theme?.colors?.$Secondary};
    font-size: 25px;
    margin: 0;
    font-weight: 800;
  }
  .topbar_logo_details_wrapper .company_details p {
    font-size: 16px;
    line-height: 19px;
    color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    margin-bottom: 5px;
  }

  /* ************* TOPBAR WITH LOGO DETAILS ENDS HERE ********************** */

  /* ************* ADDRESS BAR STYLES ********************** */
  table.address_bar_table {
    text-align: right;
    width: 100%;
  }
  table.address_bar_table tr td p {
    margin-bottom: 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    text-align: right;
    color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
  }
  /* ************* ADDRESS BAR STYLES ENDS HERE ********************** */

  /* ************* BLOCK DESIGN LOGO STYLES ********************** */
  .BlockDesignLogo .company_name {
    color: #143c69;
    font-size: 25px;
    margin: 0;
    font-weight: 800;
    margin-top: 5px;
  }
  /* ************* BLOCK DESIGN LOGO STYLES  ENDS HERE********************** */

  /* print header styles ends here */

  .info-area {
    table {
      width: 100%;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 38px 25px;
      }
      .invoice_amount {
        text-align: right;
      }
      .sent_to,
      .invoice_reference,
      .invoice_amount {
        display: flex;
      }

      .head {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        /* identical to box height */

        /* Fonts/Parent Variant */

        color: #6f6f84;
      }

      .amount {
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        /* identical to box height */

        text-align: right;

        color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
      }
    }
  }

  .table_data,
  .calculation {
    padding: 38px 25px;
  }

  .calculation {
    table {
      width: 100%;
      tr th {
        text-align: left;
      }
      tr th {
        font-weight: 600;
        font-size: 15px;
        line-height: 15px;
        -webkit-letter-spacing: 0.05em;
        -moz-letter-spacing: 0.05em;
        -ms-letter-spacing: 0.05em;
        letter-spacing: 0.05em;
        color: #6f6f84;
        padding: 7px 0;
      }
    }
    tr td {
      font-weight: 500;
      font-size: 17px;
      line-height: 17px;
      /* identical to box height */

      text-align: right;

      /* Fonts/Primary */

      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
    tr:last-child {
      td,
      th {
        border-top: 1px solid #bcb0c4;
      }
    }
  }

  .notes {
    padding: 38px 25px;
    .label {
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 15px;
      /* identical to box height */

      letter-spacing: 0.05em;

      /* Fonts/Parent Variant */

      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
    p {
      margin: 0;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 21px;

      /* Fonts/Primary */

      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
  }

  /* payment styles */
  .payment_details_card {
    border: 1px solid #e3e3e3;
    padding: 18px 22px;

    .bold_text {
      flex: 2;
    }

    .plain_text {
      flex: 1;
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
  }

  div.ant-table-body {
    overflow-x: hidden;
  }
`;
