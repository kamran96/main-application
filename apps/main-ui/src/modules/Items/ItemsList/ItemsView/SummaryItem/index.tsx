import { Card } from "antd";
import React, { FC, ReactElement } from "react";
import styled from "styled-components";
import { BoldText } from "../../../../../components/Para/BoldText";
import convertToRem from "../../../../../utils/convertToRem";
import moneyFormat from "../../../../../utils/moneyFormat";

interface IProps {
  amount: number | string;
  footerDesc: string;
  icon: ReactElement<any>;
  icon_bg: any;
}

export const SummaryItem: FC<IProps> = ({
  amount,
  footerDesc,
  icon,
  icon_bg,
}) => {
  return (
    <WrapperSummaryItem>
      <Card className="_itemviewcard">
        <div className="content_area">
          <div className="item_result flex justifyCenter">
            <div className={`${icon_bg}  icon flex alignCenter justifyCenter`}>
              <i className="flex alignCenter justifyCenter">{icon}</i>
            </div>
          </div>
        </div>
        <BoldText className="item_amount">{amount}</BoldText>
        <div className="footer">
          <div className="_footer_desc textCenter">
            <p className="m-reset">{footerDesc}</p>
          </div>
        </div>
      </Card>
    </WrapperSummaryItem>
  );
};

const WrapperSummaryItem = styled.div`
  .item_result {
    margin: ${convertToRem(21)} 0;
    .icon {
      width: ${convertToRem(49)};
      height: ${convertToRem(49)};
      border-radius: 50%;
      i {
        font-size: ${convertToRem(27)};
        color: #1f9dff;
      }
    }
  }
`;
