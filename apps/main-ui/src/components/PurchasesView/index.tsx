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
  pushDraftToInvoiceAPI,
  pushDraftToPurchaseAPI,
  findInvoiceByID,
  EmailInvoiceAPI,
} from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import {
  IInvoiceItem,
  IInvoiceType,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { useMutation, useQuery } from 'react-query';
import { NOTIFICATIONTYPE, IInvoiceMutatedResult } from '../../modal';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { PERMISSIONS } from '../Rbac/permissions';
import printDiv, { ConvertDivToPDFAndDownload } from '../../utils/Print';
import { Link, useHistory } from 'react-router-dom';
import { EmailModal } from './Email';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { PrintFormat } from '../PrintFormat';
import { PrintViewPurchaseWidget } from '../PurchasesWidget/PrintViewPurchaseWidget';
import { totalDiscountInInvoice } from '../../utils/formulas';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '../PDFs';
import DummyLogo from '../../assets/quickbook.png';
import { plainToClass } from 'class-transformer';
import { ISupportedRoutes } from '@invyce/shared/types';
interface IProps {
  type?:
    | IInvoiceType.INVOICE
    | IInvoiceType.PURCHASE_ORDER
    | IInvoiceType.BILL
    | IInvoiceType.CREDITNOTE
    | IInvoiceType.DEBITNOTE;
  id?: number | string;
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

export const PurchasesView: FC<IProps> = ({ id, type, onApprove }) => {
  /* ******API STAKE******* */

  const APISTAKE_APPROVED =
    type === 'PO' ? pushDraftToPurchaseAPI : pushDraftToInvoiceAPI;
  /* ******API STAKE ENDS HERE******* */

  /* *************** HOOKS HERE ************** */

  /* **************UTILITY HOOKS**************** */
  const { rbac } = useRbac(null);
  const { userDetails, notificationCallback } = useGlobalContext();

  const { mutate: mutateEmailInvoice, isLoading: sendingEmail } =
    useMutation(EmailInvoiceAPI);

  const history = useHistory();

  /* ************ QUERIES & MUTATIONS **************  */
  const { data, isLoading } = useQuery(
    [ReactQueryKeys.INVOICE_VIEW, id, type],
    findInvoiceByID,
    {
      enabled: !!id,
      keepPreviousData: true,
    }
  );

  const response = plainToClass(
    IInvoiceMutatedResult,
    data?.data
  )?.getConstructedResult();

  const { mutate: mutateApprove, isLoading: approving } =
    useMutation(APISTAKE_APPROVED);

  /*Query hook for  Fetching all accounts against ID */
  // const allContactsRes = useQuery([`all-contacts`, "ALL"], getAllContacts);

  /* ************** QUERIES ENDS HERE ************** */

  /* **************UTILITY HOOKS ENDS HERE**************** */

  /* LOCAL STATES */
  const [emailModal, setEmailModal] = useState(false);
  const [tableData, setTableData] = useState<IInvoiceItem[]>([]);

  /* LOCAL STATES ENDS HERE */

  /* ***** COMPONENT LIFE CYCLES */

  useEffect(() => {
    if (data?.data?.result) {
      const resolvedData = plainToClass(IInvoiceMutatedResult, data?.data);
      setTableData(
        resolvedData?.getConstructedResult().invoiceItems as IInvoiceItem[]
      );
    }
  }, [data]);

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
    const creditNoteRoute =
      response?.invoiceType === 'POE'
        ? ISupportedRoutes?.ADD_DEBIT_NOTE
        : ISupportedRoutes?.ADD_CREDIT_NOTE;
    switch (e?.key) {
      case IInvoiceActions?.APPROVE:
        history.push(
          `/app${
            response?.invoiceType === 'PO'
              ? ISupportedRoutes.CREATE_BILL
              : ISupportedRoutes.CREATE_INVOICE
          }/${response.id}`,
          {
            relation: response?.invoiceType,
          }
        );
        break;
      case IInvoiceActions?.PROCEED:
        // eslint-disable-next-line no-case-declarations
        const route = (type) => {
          switch (type) {
            case IInvoiceType.INVOICE:
              return ISupportedRoutes.CREATE_INVOICE;

            case IInvoiceType.BILL:
              return ISupportedRoutes.CREATE_BILL;
            case IInvoiceType.PURCHASE_ENTRY:
              return ISupportedRoutes.CREATE_BILL;

            case IInvoiceType.CREDITNOTE:
              return ISupportedRoutes.ADD_CREDIT_NOTE;

            case IInvoiceType.DEBITNOTE:
              return ISupportedRoutes.ADD_DEBIT_NOTE;

            default:
              return null;
          }
        };
        history.push(`/app${route(response?.invoiceType)}/${response.id}`, {
          type: response?.invoiceType,
        });
        break;
      case IInvoiceActions?.DOWNLOAD_PDF:
        onPDF();
        break;
      case IInvoiceActions?.EMAIL:
        setEmailModal(true);
        break;
      case IInvoiceActions?.CHANGE_DUE_DATE:
        switch (response.invoiceType) {
          case IInvoiceType.INVOICE:
            history.push(`/app${ISupportedRoutes.CREATE_INVOICE}/${id}`);
            break;
          case IInvoiceType.CREDITNOTE:
            history.push(`/app${ISupportedRoutes.ADD_CREDIT_NOTE}/${id}`);
            break;
          case IInvoiceType.DEBITNOTE:
            history.push(`/app${ISupportedRoutes.ADD_DEBIT_NOTE}/${id}`);
            break;
          case IInvoiceType.PURCHASE_ORDER:
            history.push(`/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}/${id}`);
            break;
          case IInvoiceType.PURCHASE_ENTRY:
            history.push(`/app${ISupportedRoutes.CREATE_BILL}/${id}`);
            break;
        }
        break;

      case IInvoiceActions?.CREDIT_NOTE:
        history?.push(`/app${creditNoteRoute}/${id}`, {
          type,
        });
        break;
      case IInvoiceActions?.PRINT:
        onPrint();

        break;
    }
  }

  const onEmail = async (values) => {
    const payload = {
      ...values,
      id,
      type: response?.invoiceType,
    };

    await mutateEmailInvoice(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          'Email Send Sucessfully'
        );

        setEmailModal(false);
      },
    });
  };

  /* *********************CALCULATIONS**************** */
  /* ****************** THIS WILL CALCULATE DISCOUNT *************** */
  const calculatedDisc: number = response && response.discount;
  /* ********* THIS IS RESPONSIBLE TO GET ITEMS DISCOUNT TOTAL ************ */
  const itemsDiscount =
    (response &&
      totalDiscountInInvoice(
        tableData,
        'itemDiscount',
        type === 'PO' ? 'POE' : 'SI'
      )) ||
    0;

  const invoiceDiscount = calculatedDisc - itemsDiscount;

  /* ************* THIS WILL CALCULATE TOTAL TAX ************* */
  const TotalTax =
    (response &&
      totalDiscountInInvoice(tableData, 'tax', type === 'PO' ? 'POE' : 'SI')) ||
    0;

  const priceAccessor =
    response?.invoiceType === IInvoiceType.DEBITNOTE ||
    response?.invoiceType === IInvoiceType?.PURCHASE_ENTRY
      ? 'purchasePrice'
      : 'unitPrice';

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
      dataIndex: priceAccessor,
      key: type === 'PO' ? `purchasePrice` : `unitPrice`,
      render: (data) => (data ? moneyFormat(data) : '-'),
    },
    response?.invoiceType !== IInvoiceType?.CREDITNOTE &&
    response?.invoiceType !== IInvoiceType?.DEBITNOTE &&
    response?.invoiceType !== IInvoiceType?.PURCHASE_ENTRY
      ? {
          title: 'DISCOUNT',
          dataIndex: 'itemDiscount',
          key: 'itemDiscount',
          render: (data) => (data ? moneyFormat(data) : '-'),
        }
      : {},
    {
      title: 'TAX',
      dataIndex: 'tax',
      key: 'tax',
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      render: (data) => moneyFormat(data),
    },
  ];

  const _options: IInvoiceOptions[] = [
    (response?.invoiceType === IInvoiceType.PURCHASE_ORDER ||
      response?.invoiceType === IInvoiceType.QUOTE) && {
      title:
        response?.invoiceType === IInvoiceType.PURCHASE_ORDER
          ? 'Create Bill'
          : 'Create Invoice',
      permission: PERMISSIONS?.PURCHASE_ORDERS_APPROVE,
      key: IInvoiceActions.APPROVE,
    },

    // response?.status === 2 &&
    //   response?.invoiceType !== 'QO' && {
    //     title: 'Proceed',
    //     permission:
    //       type === IInvoiceType.INVOICE || type === IInvoiceType.CREDITNOTE
    //         ? PERMISSIONS?.INVOICES_DRAFT_APPROVE
    //         : PERMISSIONS?.PURCHASES_DRAFT_APPROVE,
    //     key: IInvoiceActions.PROCEED,
    //   },
    {
      title: 'Print',
      permission: null,
      key: IInvoiceActions.PRINT,
    },

    (response?.invoiceType === IInvoiceType?.PURCHASE_ENTRY ||
      response?.invoiceType === IInvoiceType?.INVOICE) && {
      title:
        response?.invoiceType === IInvoiceType.PURCHASE_ENTRY
          ? 'Add Debit note'
          : 'Add Credit note',
      permission: PERMISSIONS?.INVOICES_CREATE,
      key: IInvoiceActions.CREDIT_NOTE,
    },

    {
      title: 'Email',
      permission: null,
      key: IInvoiceActions.EMAIL,
    },
    // {
    //   title: 'Change Due Date',
    //   permission: PERMISSIONS?.INVOICES_CREATE,
    //   key: IInvoiceActions.CHANGE_DUE_DATE,
    // },
  ];
  const { organization } = userDetails;
  const {
    address: organizationAddress,
    name: organizationName,
    email: organizationEmail,
    phoneNumber: organizationContact,
    website,
  } = organization;
  const { city, country, postalCode } = organizationAddress;

  const headerprops = {
    organizationName,
    city,
    country,
    title: '',
    organizationContact,
    organizationEmail,
    address: '',
    code: postalCode,
    logo: DummyLogo,
    website,
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <>
        {_options?.map((option, index) => {
          return rbac.can(option?.permission) || option?.permission === null ? (
            <Menu.Item key={option?.key}>{option?.title}</Menu.Item>
          ) : null;
        })}
        {response?.contact ? (
          <li
            className="ant-dropdown-menu-item ant-dropdown-menu-item-only-child"
            role="menuitem"
            data-menu-id="rc-menu-uuid-46302-3-change_due_date"
          >
            <span className="ant-dropdown-menu-title-content">
              <PDFDownloadLink
                document={
                  <InvoicePDF
                    header={headerprops}
                    data={response}
                    type={
                      type === IInvoiceType.CREDITNOTE
                        ? 'credit-note'
                        : type === IInvoiceType.BILL ||
                          type === IInvoiceType?.PURCHASE_ORDER
                        ? 'PO'
                        : 'SI'
                    }
                    reportGeneratedUser={userDetails?.profile?.fullName}
                  />
                }
                fileName={response?.invoiceNumber || 'invoice'}
              >
                Download as PDF
              </PDFDownloadLink>
            </span>
          </li>
        ) : (
          ''
        )}
      </>
    </Menu>
  );

  const addresses = response?.contact?.addresses || [];

  const getTotal = () => {
    const { balance } = (response?.relation?.links?.length &&
      response?.relation?.links?.reduce((a, b) => {
        return { balance: a.balance + b.balance };
      })) || { balance: 0 };

    return response?.netTotal - balance;
  };

  const Title =
    type === IInvoiceType.INVOICE
      ? 'Invoice'
      : type === IInvoiceType.BILL
      ? 'Bills'
      : type === IInvoiceType.PURCHASE_ORDER
      ? 'Purchase Order'
      : type === IInvoiceType.CREDITNOTE
      ? 'Credit Note'
      : type === IInvoiceType.DEBITNOTE
      ? 'Debit Note'
      : 'Quote';

  return (
    <WrapperNewPurchaseView>
      <div className="pv-10">
        <Row gutter={24}>
          <Col span={12}>
            <Heading type="container">
              {' '}
              {Title}
              {response?.invoiceNumber ? `(${response?.invoiceNumber})` : null}
            </Heading>
          </Col>
          <Col span={12}>
            <div className="textRight">
              <Dropdown overlay={menu}>
                <Button type="primary">{Title}&nbsp;Options</Button>
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
                      <td className="head">To</td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          className="mt-8"
                          to={`/app${ISupportedRoutes.CONTACTS}/${
                            response && response.contactId
                          }`}
                        >
                          <Capitalize>
                            <BOLDTEXT>{response?.contact?.name}</BOLDTEXT>{' '}
                          </Capitalize>
                        </Link>
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
                        <Capitalize></Capitalize>
                      </td>
                    </tr>
                    {addresses?.length > 0 && (
                      <>
                        <tr>
                          <td className="head">Address</td>
                        </tr>
                        <tr>
                          <td>
                            <Capitalize>
                              {addresses[0]?.country},&nbsp;
                              {addresses[0]?.city},&nbsp;
                              {addresses[0]?.postalCode}&nbsp;
                            </Capitalize>
                          </td>
                        </tr>
                      </>
                    )}
                  </table>
                </td>
                <td className="invoice_reference">
                  <table>
                    <tr>
                      <td className="head">Order Number</td>
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
                      <td className="head">Total</td>
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
                    {response?.dueDate && (
                      <>
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
                      </>
                    )}
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
            columns={
              type === IInvoiceType?.PURCHASE_ORDER
                ? columns.filter(
                    (i, index) =>
                      i?.title !== 'RATE' &&
                      i?.title !== 'DISCOUNT' &&
                      i?.title !== 'TAX'
                  )
                : columns
            }
            pagination={false}
            size="small"
          />
        </div>
        <Seprator />
        <Row gutter={24}>
          <Col span={8} offset={8} pull={8}>
            {response?.status !== 2 && (
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
            )}
          </Col>
          <Col span={8}>
            <div className="calculation textRight">
              {response?.invoiceType !== 'PO' && (
                <table>
                  <tr>
                    <th>Sub Total</th>
                    <td>{moneyFormat(response?.grossTotal)}</td>
                  </tr>
                  {type !== IInvoiceType.PURCHASE_ORDER &&
                    type !== IInvoiceType.BILL &&
                    type !== IInvoiceType.CREDITNOTE &&
                    type !== IInvoiceType.DEBITNOTE && (
                      <tr>
                        <th>Invoice Discount</th>
                        <td>{response && moneyFormat(invoiceDiscount)}</td>
                      </tr>
                    )}
                  <tr>
                    <th>Tax Rate</th>
                    <td>{response && moneyFormat(TotalTax)}</td>
                  </tr>
                  {response?.relation?.links?.length > 0 &&
                    response?.relation?.links?.map((item, key) => {
                      const generateLink = () => {
                        let link = ``;
                        switch (response?.relation?.type) {
                          case 'CN':
                            link = `/app${ISupportedRoutes.CREDIT_NOTES}/${item.id}`;
                            break;
                          case 'SI':
                            link = `/app${ISupportedRoutes.INVOICES_VIEW}/${item.id}`;
                            break;
                          case 'PO':
                            link = `/app${ISupportedRoutes.PURCHASES}/${item.id}`;
                            break;

                          default:
                            return ``;
                        }
                        return link;
                      };
                      return (
                        <tr>
                          <th>
                            <Link to={generateLink()}>
                              {item?.invoiceNumber}
                            </Link>
                          </th>
                          <td>{moneyFormat(item?.balance)}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <th>Total</th>
                    <td>{moneyFormat(getTotal())}</td>
                  </tr>
                </table>
              )}
            </div>
          </Col>
          {response?.comment && (
            <Col span={10}>
              <div className="notes">
                <h5 className="label">
                  <BOLDTEXT>Notes</BOLDTEXT>
                </h5>
                <p>{response?.comment}</p>
              </div>
            </Col>
          )}
        </Row>
      </Card>
      <EmailModal
        onSendEmail={onEmail}
        visibility={emailModal}
        setVisibility={(a) => setEmailModal(a)}
      />
      <div className="_visibleOnPrint" ref={printRef}>
        <PrintFormat>
          <PrintViewPurchaseWidget
            hideCalculation={response?.invoiceType === 'PO' ? true : false}
            type={
              type === IInvoiceType.CREDITNOTE
                ? 'credit-note'
                : type === IInvoiceType.BILL ||
                  type === IInvoiceType?.PURCHASE_ORDER
                ? 'PO'
                : 'SI'
            }
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

  @media screen and (max-width: 1600px) {
    padding: 0 40px;
  }
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
    color: ${(props: IThemeProps) =>
      props?.theme?.theme === 'dark'
        ? props?.theme?.colors?.$BLACK
        : props?.theme?.colors?.$Secondary};
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

        color: ${({ theme }: IThemeProps) =>
          theme?.theme === 'dark'
            ? theme?.colors?.$BLACK
            : theme?.colors?.$Secondary};
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
