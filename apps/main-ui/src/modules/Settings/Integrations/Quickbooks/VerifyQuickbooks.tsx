/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { QuickbooksVerifycationAPI } from '../../../../api';
import { VerifiedIcon } from '../../../../assets/icons';
import Quickbook from '../../../../assets/quickbook.png';
import { Loader } from '../../../../components/Loader';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../../modal';

export const VerifyQuickBooks: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory?.history;
  const {
    mutate: mutateVerify,
    isLoading,
    data,
  } = useMutation(QuickbooksVerifycationAPI);

  const Verified = async (search) => {
    const payload = {
      token: search,
    };

    await mutateVerify(payload);
  };

  useEffect(() => {
    if (data?.data?.result?.modules) {
      setTimeout(() => {
        const redirectURL = `${ISupportedRoutes.DASHBOARD_LAYOUT}${
          ISupportedRoutes?.SETTINGS
        }${
          ISupportedRoutes?.INTEGRATIONS
        }?quickbooks=verified&fetchItems=${btoa(
          JSON.stringify(data?.data?.result?.modules)
        )}`;

        routeHistory?.history?.push(redirectURL);
      }, 1500);
    }
  }, [data]);

  useEffect(() => {
    if (location?.search) {
      const { search } = location;
      Verified(search);
    }
  }, [location]);
  return (
    <WrapperVerificationQuickbooks>
      <div className="wrapper">
        <div
          className="logo-title
            "
        >
          <img
            className="company_logo"
            src={Quickbook}
            alt={'quickbooks logo'}
          />
          <h2>Intuit’s Quick Books</h2>
        </div>
        <div className="description">
          <p className="textCenter">
            Verification is {isLoading ? 'in progress' : 'finished'}
          </p>
        </div>
        <div className="loading_wrapper">
          <div className="verified_icon">
            {isLoading ? <Loader /> : <VerifiedIcon />}
            <p className="label">{isLoading ? 'Please wait' : 'Verified'}</p>
          </div>
        </div>
      </div>
    </WrapperVerificationQuickbooks>
  );
};

const WrapperVerificationQuickbooks = styled.div`
  padding: 20px 0;
  background: #f9f9f9;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .wrapper {
    min-height: 426px;
    align-items: center;
    background: #ffffff;
    min-width: 533px;
    max-width: 533px;
    border-radius: 10px;
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
      height: 93px;
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
