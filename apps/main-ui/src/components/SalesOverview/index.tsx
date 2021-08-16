import dollarCircleOutlined from "@iconify-icons/ant-design/dollar-circle-outlined";
import Icon from "@iconify/react";
import { Tooltip } from "antd";
import React, { FC } from "react";
import styled from "styled-components";

import { Color, IDashboardSalesOverview } from "../../modal";
import { kValue } from "../../utils/helperFunctions";
import { Card } from "../Card";
import { Inflation } from "../Inflation";
import { BoldText } from "../Para/BoldText";
import { H4 } from "../Typography";

interface IProps {
  data: IDashboardSalesOverview;
}

export const Sales: FC<IProps> = ({ data }) => {
  return (
    <WrapperSales>
      <Card className="_salescard">
        <div className="content_area">
          <div className="sales_result flex alignCenter">
            <div className="icon flex alignCenter justifyCenter">
              <i className="flex alignCenter justifyCenter">
                <Icon icon={dollarCircleOutlined} />
              </i>
            </div>
            <div className="sales_overview">
              <H4 className="_sales_title">Total Sales</H4>
              <div className="flex alignCenter justifySpaceBetween">
                <Tooltip placement={"top"} title={`${data?.totalSales}`}>
                  <BoldText className="sales_amount">
                    {kValue(data?.totalSales)}
                  </BoldText>
                </Tooltip>
                <Inflation
                  value={`${data?.salePercent?.toFixed(2)} %`}
                  status={data?.salePercent >= 0 ? "up" : "down"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="_footer_desc textCenter">
            <p className="m-reset">
              <Tooltip placement={"top"} title={data?.saleDifference}>
                {kValue(data?.saleDifference?.toFixed(0))}
              </Tooltip>{" "}
              short compare to last week
            </p>
          </div>
        </div>
      </Card>
    </WrapperSales>
  );
};

const WrapperSales = styled.div`
  ._salescard {
    min-height: 195px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .sales_result {
    margin: 21px 0;
    .icon {
      width: 49px;
      min-width: 49px;
      height: 49px;
      background: #fbcf323b;
      border-radius: 50%;
      margin-right: 10px;
      i {
        font-size: 27px;
        color: #fbce30;
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
