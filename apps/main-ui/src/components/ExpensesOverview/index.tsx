import Icon from "@iconify/react";
import { Select, Tooltip } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { Card } from "../Card";
import { H4 } from "../Typography";
import { Color, IDashboardSalesOverview } from "../../modal";
import fileInvoiceDollar from "@iconify-icons/la/file-invoice-dollar";
import { BoldText } from "../Para/BoldText";
import { Inflation } from "../Inflation";
import { kValue } from "../../utils/helperFunctions";

const { Option } = Select;

interface IProps {
  data: IDashboardSalesOverview;
}

export const ExpensesOverview: FC<IProps> = ({ data }) => {
  return (
    <WrapperExpensesOverview>
      <Card className="_salescard">
        <div className="content_area">
          <div className="sales_result flex alignCenter">
            <div className="icon flex alignCenter justifyCenter">
              <i className="flex alignCenter justifyCenter">
                <Icon icon={fileInvoiceDollar} />
              </i>
            </div>
            <div className="sales_overview">
              <H4 className="_sales_title">Total Expenses</H4>
              <div className="flex alignCenter ">
                <Tooltip placement={"top"} title={data?.totalExpenses}>
                  <BoldText className="sales_amount">
                    {kValue(data?.totalExpenses?.toFixed(0))}
                  </BoldText>
                </Tooltip>
                <Inflation
                  value={`${data?.purchasePercent?.toFixed(2)} %`}
                  status={data?.purchasePercent >= 0 ? "up" : "down"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="foooter">
          <div className="_footer_desc textCenter">
            <p className="m-reset">
              <Tooltip placement={"top"} title={data?.expenseDifference}>
                {kValue(data?.expenseDifference?.toFixed(0))}
              </Tooltip>{" "}
              increase compare to last week
            </p>
          </div>
        </div>
      </Card>
    </WrapperExpensesOverview>
  );
};

const WrapperExpensesOverview = styled.div`
  ._salescard {
    min-height: 195px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 28px;
  }

  .sales_result {
    margin: 35px 0;
    .icon {
      width: 49px;
      min-width: 49px;
      height: 49px;
      background: #ff646457;
      border-radius: 50%;
      margin-right: 10px;
      i {
        font-size: 27px;
        color: #ff4f4f;
      }
    }
  }

  .sales_overview {
    .sales_amount {
      font-size: 24px;
      font-weight: 500;
      margin-right: 8px;
    }
  }
  ._footer_desc {
    font-style: normal;
    font-weight: normal;
    line-height: 14px;
    color: #656565;
  }
`;
