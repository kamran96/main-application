import { Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import GmailLogo from '../../../../assets/gmail.png';
import { Loader } from '../../../../components/Loader';
import { VerifiedIcon } from '../../../../assets/icons';
import { useMutation } from 'react-query';
import { GmailVerificationAPI } from '../../../../api';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { useEffect } from 'react';

export const VerifyGmail = () => {
  const { mutate: mutateVerifyGmail } = useMutation(GmailVerificationAPI);
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const { search } = history?.location;
  useEffect(() => {
    if (search) {
      const code = search?.split(`&scope`)[0]?.split('code=')[1];
      const payload = {
        code,
      };

      mutateVerifyGmail(payload);
    }
  }, [search]);

  return (
    <WrapperVerifyGmail>
      <Card>
        <div
          className="logo-title
            "
        >
          <img
            className="company_logo"
            src={GmailLogo}
            alt={'quickbooks logo'}
          />
          <h2>Gmail</h2>
        </div>
        <div className="description">
          <p className="textCenter">
            Verification is {false ? 'in progress' : 'finished'}
          </p>
        </div>
        <div className="loading_wrapper">
          <div className="verified_icon">
            {false ? <Loader /> : <VerifiedIcon />}
            <p className="label">{false ? 'Please wait' : 'Verified'}</p>
          </div>
        </div>
      </Card>
    </WrapperVerifyGmail>
  );
};

const WrapperVerifyGmail = styled.div`
  padding: 20px 0;
  background: #f9f9f9;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-card {
    border-radius: 10px;
    background: #ffffff;
    border: none;
  }
  .ant-card-body {
    min-height: 426px;
    align-items: center;
    min-width: 533px;
    max-width: 533px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .logo-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    h2 {
      font-size: 32px;
      margin-bottom: 14px;
      margin-top: 14px;
    }
    .description p {
      margin: 0;
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 23px;
      /* identical to box height */

      color: #4b4b4b;
    }

    img.company_logo {
      width: 93px;
    }

    .loading_wrapper {
      .verified_icon {
        margin-top: 22px;
        svg {
        }
        .label {
          margin-top: 26px;
          text-align: center;
          font-style: normal;
          font-weight: normal;
          font-size: 20px;
          line-height: 23px;
          /* identical to box height */

          color: #4b4b4b;
        }
      }

      .ant-spin span {
        font-size: 72px !important;
      }
    }
  }
`;
