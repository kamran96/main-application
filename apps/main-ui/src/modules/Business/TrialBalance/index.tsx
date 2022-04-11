import { Col, Row } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { TrialBalanceList } from './TrialBalanceList';

export const TraialBalance: FC = () => {
  return (
    <WrapperTrialBalance>
      <Row gutter={24}>
        <Col span={18} offset={3}>
          <TrialBalanceList />
        </Col>
      </Row>
    </WrapperTrialBalance>
  );
};
const WrapperTrialBalance = styled.div``;
