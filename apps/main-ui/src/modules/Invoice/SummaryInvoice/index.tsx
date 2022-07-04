import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import convertToRem from '../../../utils/convertToRem';
import { BoldText } from '../../../components/Para/BoldText';
import { Color } from '../../../modal';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { Card } from '../../../components/Card';

interface IProps {
  amount: number;
  footerDesc: string;
  icon: ReactElement<any>;
  icon_bg: any;
}

export const SummaryInvoice: FC<IProps> = ({
  amount,
  footerDesc,
  icon,
  icon_bg,
}) => {
  return (
    <WrapperSummaryInvoice>
      <Card className="_invoiceitemcard">
        <div className="content_area">
          <div className="item_result flex alignCenter">
            <div className={`${icon_bg}  icon flex alignCenter justifyCenter`}>
              <i className="flex alignCenter justifyCenter">{icon}</i>
            </div>
          </div>
        </div>
        <BoldText className="item_amount">{amount}</BoldText>
        <div className="footer">
          <div className="_footer_desc textCenter">
            <p className="m-reset default-text">{footerDesc}</p>
          </div>
        </div>
      </Card>
    </WrapperSummaryInvoice>
  );
};

const WrapperSummaryInvoice = styled.div`
  ._invoiceitemcard {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: ${convertToRem(16)};
    .item_amount {
      font-size: ${convertToRem(24)};
      line-height: ${convertToRem(28)};
      font-weight: 500;
      display: flex;
      justify-content: center;
    }
  }
  .alignCenter {
    justify-content: center;
  }
  ._color {
    background: #00b9ff30;
  }
  ._color1 {
    background: rgba(255, 165, 31, 0.37);
  }
  ._color2 {
    background: rgba(0, 245, 98, 0.233);
  }
  ._color3 {
    background: rgba(38, 0, 255, 0.212);
  }

  .item_result {
    margin: ${convertToRem(21)} 0;
    .icon {
      width: ${convertToRem(49)};
      height: ${convertToRem(49)};
      border-radius: 50%;
      i {
        font-size: ${convertToRem(27)};
      }
    }
  }
`;
