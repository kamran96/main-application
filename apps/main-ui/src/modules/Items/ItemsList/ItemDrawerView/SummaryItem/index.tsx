// import { Card } from 'antd';
import { Card, BoldText } from '@components';
import React, { FC, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import convertToRem from '../../../../../utils/convertToRem';
import moneyFormat from '../../../../../utils/moneyFormat';

interface IProps {
  amount: number | string;
  footerDesc: string;
  icon: ReactElement<any>;
  icon_bg: any;
  card?: any;
}

export const SummaryItem: FC<IProps> = ({
  amount,
  footerDesc,
  icon,
  icon_bg,
  card,
}) => {
  return (
    <WrapperSummaryItem>
      <Card
        className={`_itemviewcard`}
        style={{ background: card, height: '140px' }}
      >
        <div className="content_area">
          <div className="item_result flex justifyCenter">
            <div className={`${icon_bg}  icon flex alignCenter justifyCenter`}>
              <i className="flex alignCenter justifyCenter">{icon}</i>
            </div>
          </div>
        </div>
        <BoldText className="item_amount">{amount} </BoldText>
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
    margin: ${convertToRem(18)} 0;
    .icon {
      width: ${convertToRem(35)};
      height: ${convertToRem(35)};
      border-radius: 50%;
      i {
        font-size: ${convertToRem(20)};
        color: #1f9dff;
      }
    }
  }
  .footer {
    padding: 0 0 ${convertToRem(15)} 0;
  }
`;
