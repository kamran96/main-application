import { Col, Row } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { H4 } from '@components';
import { Gmail } from './Gmail';
import { QuickBooks } from './Quickbooks';
import { Xero } from './Xero';
export const Integrations: FC = () => {
  return (
    <WrapperIntegrations>
      <div className="header">
        <h4>Integrations</h4>
      </div>

      <div className="integration_packages">
        <div className="title">
          <H4>Accounting</H4>
        </div>
        <div className="grid_layout">
          <div className="module">
            <Xero />
          </div>
          <div className="module">
            <QuickBooks />
          </div>
        </div>
      </div>
      <div className="integration_packages">
        <div className="title">
          <H4>Communication</H4>
        </div>
        <div className="grid_layout">
          <div className="module">
            <Gmail />
          </div>
        </div>
      </div>
    </WrapperIntegrations>
  );
};

const WrapperIntegrations = styled.div`
  .header {
    background: #143c69;
    padding: 8px 31px;
    h4 {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.03em;
      text-transform: capitalize;
      color: #ffffff;
    }
  }

  .integration_packages {
    padding: 24px 32px;
    .grid_layout {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      margin-left: -15px;
      margin-right: -15px;
      div.module {
        grid-column: span 4;
        padding: 15px 15px;
      }
    }
  }
`;
