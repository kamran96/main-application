import { Button, Select } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { Color } from '../../modal';
import moneyFormat from '../../utils/moneyFormat';
import { Card } from '../Card';
import { P } from '../Para/P';
import { Seprator } from '../Seprator';
import { H4 } from '../Typography';

const { Option } = Select;

export const ProfitAndLossOverview: FC = () => {
  return (
    <WrapperPayablesOverview>
      <Card className="_card_wrapper">
        <div className="flex alignCenter justifySpaceBetween">
          <H4>Profit and Loss</H4>
          <div className="_filter textRight">
            <Select
              size="small"
              showSearch
              style={{ width: '100%', textAlign: 'right' }}
              placeholder="Select Time"
              optionFilterProp="children"
              defaultValue={'current_week'}
            >
              <Option value="today">Today</Option>
              <Option value="current_week">This Week</Option>
              <Option value="current_month">This Month</Option>
              <Option value="current_year">This Year</Option>
            </Select>
          </div>
        </div>
        <Seprator />
        <div className="mt-20">
          {[0, 1, 2].map((item, index) => (
            <div
              key={index}
              className="flex alignCenter justifySpaceBetween listItem"
            >
              <P>Net income of last 15 days</P>
              <P>{moneyFormat('150')}</P>
            </div>
          ))}
        </div>
        <div className="footer flex alignCenter justifyCenter mt-20">
          <Button type="link" size="middle">
            View Details
          </Button>
        </div>
      </Card>
    </WrapperPayablesOverview>
  );
};
const WrapperPayablesOverview = styled.div`
  .listItem {
    background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
    box-shadow: 0px 0px 3px rgba(115, 115, 115, 0.13);
    border-radius: 4px;
    margin: 12px 0;
    padding: 11px 8px;
  }
`;
