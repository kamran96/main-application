import { Col, Row } from "antd";
import React, { FC } from "react";
import { IncomeStatementList } from "./List";
import { IncomeStatementWrapper } from "./styled";

export const IncomeStatement: FC = () => {
  return (
    <IncomeStatementWrapper>
      <Row gutter={24}>
        <Col span={18} offset={3}>
          <IncomeStatementList />
        </Col>
      </Row>
    </IncomeStatementWrapper>
  );
};
