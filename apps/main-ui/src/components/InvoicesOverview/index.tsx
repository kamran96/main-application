import Icon from '@iconify/react';
import { Select, Tooltip } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Card } from '../Card';
import { H4 } from '../Typography';
import { Color, IDashboardSalesOverview } from '../../modal';
import fileText from '@iconify-icons/feather/file-text';
import { BoldText } from '../Para/BoldText';
import { Inflation } from '../Inflation';
import { kValue } from '../../utils/helperFunctions';

const { Option } = Select;

interface IProps {
  data: IDashboardSalesOverview;
}

export const InvoicesOverview: FC<IProps> = ({ data }) => {
  return (
    <WrapperInvoicesOverview>
      <Card className="_salescard">
        <div className="content_area">
          <div className="sales_result flex alignCenter">
            <div className="icon flex alignCenter justifyCenter">
              <i className="flex alignCenter justifyCenter">
                <Icon icon={fileText} />
              </i>
            </div>
            <div className="sales_overview">
              <H4 className="_sales_title white-space-wrap ">
                Total Invoices Send
              </H4>
              <div className="flex alignCenter ">
                <Tooltip placement={'top'} title={data?.totalInvoiceSend}>
                  <BoldText className="sales_amount">
                    {kValue(data?.totalInvoiceSend?.toFixed(0))}
                  </BoldText>
                </Tooltip>
                <Inflation
                  value={`${data?.invoicePercent?.toFixed(2)} %`}
                  status={data?.invoicePercent >= 0 ? 'up' : 'down'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="_footer_desc textCenter">
            <p className="m-reset">
              You have sent{' '}
              <Tooltip placement={'top'} title={data?.invoiceDifference}>
                {kValue(data?.invoiceDifference?.toFixed(0))}
              </Tooltip>{' '}
              invoices last week
            </p>
          </div>
        </div>
      </Card>
    </WrapperInvoicesOverview>
  );
};

const WrapperInvoicesOverview = styled.div`
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
      background: #00b9ff30;
      border-radius: 50%;
      margin-right: 10px;
      i {
        font-size: 27px;
        color: #1f9dff;
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
