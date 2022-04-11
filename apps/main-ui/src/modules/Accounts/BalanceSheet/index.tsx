import { Col, Row } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { BalanceSheetList } from './BalanceSheetList';

export const BalanceSheet: FC = () => {
  return (
    <WrapperBalanceSheet>
      <Row gutter={24}>
        <Col span={18} offset={3}>
          <BalanceSheetList />
        </Col>
      </Row>
    </WrapperBalanceSheet>
  );
};

const WrapperBalanceSheet = styled.div``;
