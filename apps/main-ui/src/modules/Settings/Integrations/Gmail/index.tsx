import { Card, Button } from 'antd';
import React from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { GmailIntegrationAPI } from '../../../../api';
import GmailLogo from '../../../../assets/gmail.png';
import { H4 } from '../../../../components/Typography';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';

export const Gmail = () => {
  const {
    mutate: mutateIntegrateGmail,
    data,
    isLoading,
  } = useMutation(GmailIntegrationAPI, {
    onSuccess: (data) => {
      if (data?.data?.result) {
        const { result } = data?.data;
        window?.location?.replace(result);
      }
    },
  });

  const ConnectGmail = async () => {
    await mutateIntegrateGmail();
  };

  return (
    <WrapperGmailIntegration>
      <img className="service_logo" src={GmailLogo} alt={'quickbooks logo'} />
      <H4>Gmail</H4>
      <div className="description">
        <p>Pull emails, bills and invoices</p>
      </div>
      <Button
        loading={isLoading}
        onClick={ConnectGmail}
        type="default"
        size="middle"
      >
        {false ? 'verifying..' : 'Connect'}
      </Button>
    </WrapperGmailIntegration>
  );
};

const WrapperGmailIntegration = styled(Card)`
  border-radius: 6px;
  background: ${(props: IThemeProps) =>
    props?.theme?.colors?.sidebarBg || '#ffff'};
  .ant-card-body {
    display: flex;

    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 18px 17px;
    min-height: 270px;
    max-height: 270px;
    align-items: center;
    text-align: center;
    .service_logo {
      width: 60px;
    }

    .description p {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 141.19%;
      /* or 20px */

      text-align: center;

      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.textTd || '#303030'};
      margin: 0;
    }
  }
`;
