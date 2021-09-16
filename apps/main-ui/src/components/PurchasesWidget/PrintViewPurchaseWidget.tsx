import dayjs from "dayjs";
import React, { FC } from "react";
import { IInvoiceResult, IAddress } from "../../modal/invoice";
import { totalDiscountInInvoice } from "../../utils/formulas";
import moneyFormat from "../../utils/moneyFormat";
import { BoldText } from "../Para/BoldText";
import { PrintHeaderFormat, TableDivisions } from "../PrintHeader";
import { Addressbar, TopbarLogoWithDetails } from "../PrintHeader/Formats";
import { Capitalize } from "../Typography";

interface IProps {
  data?: IInvoiceResult;
  type?: "SI" | "PO" | "QO" | "BILL" |"credit-note";
  heading?: string;
  hideCalculation?: boolean;
}

export const PrintViewPurchaseWidget: FC<IProps> = ({
  data,
  type,
  heading,
  hideCalculation = false,
}) => {
  let asessorTableData =
    type === "SI"
      ? "invoice_items"
      : type === "PO"
      ? "purchase_items"
      : type === "BILL"
      ? "bill_items" : type==="credit-note" ? 'credit_note_items'
      : "invoice_items";

  let priceAccessor =
    type === "SI" || "QO" || "BILL" ? "unitPrice" : "purchasePrice";

  const calculatedDisc: number = data && data.discount;
  /* ********* THIS IS RESPONSIBLE TO GET ITEMS DISCOUNT TOTAL ************ */
  const itemsDiscount =
    (data &&
      totalDiscountInInvoice(
        asessorTableData,
        "itemDiscount",
        type === "PO" ? "POE" : "SI"
      )) ||
    0;

  const recieverAddress: IAddress =
    data?.contact?.addresses?.length && data?.contact?.addresses[0];

  const invoiceDiscount = calculatedDisc - itemsDiscount;

  /* ************* THIS WILL CALCULATE TOTAL TAX ************* */
  const TotalTax =
    (data &&
      totalDiscountInInvoice(
        asessorTableData,
        "tax",
        type === "PO" ? "POE" : "SI"
      )) ||
    0;

  let _heading =
    data.invoiceType === "SI"
      ? "Sale Invoice"
      : data.invoiceType === "PO" || data.invoiceType === "POE"
      ? "Purchase Order"
      : data.invoiceType === "QO"
      ? data.invoiceType === "BILL"
        ? "Bill"
        : "Quotation"
      : "";

  return (
    <div id="purchase_order_print_view">
      <div className="table">
        <PrintHeaderFormat hasbackgroundColor={true}>
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
        <div className="main_wrapper">
          <div className="invoice_dispatch_details">
            <div className="billed">
              <table className="_main_table" style={{ width: "100%" }}>
                <tr>
                  <td>
                    <div>
                      <table>
                        <tr>
                          <td className="head">Billed to,</td>
                        </tr>
                        <tr>
                          <td>
                            <BoldText style={{ margin: 0 }}>
                             <Capitalize> {data?.contact?.name || ""}</Capitalize>
                            </BoldText>
                          </td>
                        </tr>
                        <tr>
                          <td>{recieverAddress?.city}</td>
                        </tr>
                        <tr>
                          <td>{recieverAddress?.postalCode}</td>
                        </tr>
                        <tr>
                          <td>{recieverAddress?.country}</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                  <td className="invoices_details">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <table>
                        <tr>
                          <td className="head">
                            Invoice number
                            <BoldText style={{ color: "#222234" }}>
                              {data?.invoiceNumber}
                            </BoldText>
                          </td>
                        </tr>
                        <tr>
                          <td className="head">
                            Reference
                            <BoldText style={{ color: "#222234" }}>
                              {data?.reference}
                            </BoldText>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <table>
                        <tr>
                          <td className="head">
                            <div>
                              Invoice Date
                              <BoldText style={{ color: "#222234" }}>
                                {dayjs(data?.issueDate)?.format("D MMM, YYYY")}
                              </BoldText>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="head">
                            {data?.dueDate && (
                              <div>
                                Due Date
                                <BoldText style={{ color: "#222234" }}>
                                  {dayjs(data?.dueDate)?.format("D MMM, YYYY")}
                                </BoldText>
                              </div>
                            )}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <table style={{ borderSpacing: 0 }} className="table_list">
            <thead>
              <tr>
                {/* <th style={{ textAlign: "center" }}> #</th> */}
                <th style={{ textAlign: "left" }}>Item Name</th>

                <th style={{ textAlign: "center" }}> Qty</th>
                <th style={{ textAlign: "center" }}>
                  {" "}
                  {type === "SI" ? "Unit Price" : "Purchase"}{" "}
                </th>
                <th style={{ textAlign: "center" }}> Disc</th>
                <th style={{ textAlign: "center" }}> Tax</th>
                <th style={{ textAlign: "center" }}> Amount</th>
              </tr>
            </thead>
            <tbody>
              {data[asessorTableData] &&
                Array.isArray(data[asessorTableData]) &&
                data[asessorTableData]
                  .sort((a, b) => {
                    return a.sequence - b.sequence;
                  })
                  .map((listItem, index) => {
                    return (
                      <tr>
                        {/* <td style={{ textAlign: "center" }}>
                          <BoldText>{index + 1}</BoldText>
                        </td> */}
                        <td>
                          <p className="item_name">
                            {listItem.item.code} / {listItem.item.name}
                          </p>
                          <p className="item_desc">{listItem.description}</p>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {listItem.quantity}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {listItem[priceAccessor]
                            ? moneyFormat(listItem[priceAccessor])
                            : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {listItem.itemDiscount &&
                          listItem.itemDiscount.includes("%")
                            ? `${listItem.itemDiscount}%`
                            : listItem.itemDiscount
                            ? moneyFormat(listItem.itemDiscount)
                            : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>{listItem.tax}</td>
                        <td style={{ textAlign: "center" }}>
                          {listItem.total ? moneyFormat(listItem.total) : "-"}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          <div
            style={{
              padding: "20px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="flex aliginCenter justifySpaceBetween"
          >
            {true ? (
              // {data && data.comment ? (
              <div className="comment area ">
                <BoldText style={{ color: "#656584" }} className="pv-10">
                  Note:
                </BoldText>
                <div
                  style={{
                    padding: "4px 0",
                    marginRight: "40px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      paddingRight: 0,
                      color: "#222234",
                      lineHeight: "17px",
                    }}
                  >
                    {/* {data.comment} */}
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Quis nobis, consequatur facilis facere architecto suscipit
                    recusandae, quisquam accusantium ipsa tempore, modi enim
                    aspernatur? Sit neque ullam ratione corrupti, sed aperiam.
                  </p>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {!hideCalculation ? (
              <div className="total">
                <table
                  style={{ borderSpacing: "0 !important" }}
                  className="total_table"
                >
                  <tr>
                    <th>Sub Total</th>
                    <td>{data && moneyFormat(data.grossTotal)}</td>
                  </tr>
                  <tr>
                    <th>Items Discount</th>
                    <td>{moneyFormat(itemsDiscount)}</td>
                  </tr>
                  <tr>
                    <th>Invoice Discount</th>
                    <td>{moneyFormat(invoiceDiscount)}</td>
                  </tr>
                  <tr>
                    <th>Tax</th>
                    <td>{moneyFormat(TotalTax)}</td>
                  </tr>

                  <tr>
                    <th>Grand Total</th>
                    <td>
                      <BoldText style={{ fontSize: 16 }}>
                        {moneyFormat(data.netTotal)}
                      </BoldText>
                    </td>
                  </tr>
                </table>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div style={{ padding: "20px 0" }}>
            <div className="terms">
              <BoldText style={{ color: "#656584" }} className="pv-10">
                Terms & Conditions
              </BoldText>
              <div
                style={{
                  padding: "4px 0",
                  marginRight: "40px",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    paddingRight: 0,
                    color: "#222234",
                    lineHeight: "17px",
                  }}
                >
                  {/* {data.comment} */}
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis
                  nobis, consequatur facilis facere architecto suscipit
                  recusandae, quisquam accusantium ipsa tempore, modi enim
                  aspernatur? Sit neque ullam ratione corrupti, sed aperiam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
