import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { VerifyingIllustrator } from '../../assets/icons';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import convertToRem from '../../utils/convertToRem';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { verifyUserInvitationAPI } from '../../api/users';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const VerifyUser = () => {
  // const [mutateVerify, resMutateVerify] = useMutation(verifyUserInvitationAPI);

  // const {routeHistory} = useGlobalContext();
  // const {history} = routeHistory;
  // const {search} = history?.location;

  // useEffect(()=>{
  //   if(search){
  //     const payload = {
  //       code: search?.split("code=")[1]
  //     };

  //     mutateVerify(payload, {
  //       onSuccess: (data)=>{
  //         console.log(data, "check data")
  //       }
  //     })

  //   }
  // },[search])

  return (
    <VerifyWrapper>
      <Card bordered={false} className="verify-card">
        <VerifyingIllustrator />
        <p className="loading-description">
          Please wait for a while we are verifying your account{' '}
        </p>
        <Spin indicator={antIcon} />
      </Card>
    </VerifyWrapper>
  );
};

const VerifyWrapper = styled.div`
  background: #f8fcff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .verify-card {
    width: ${convertToRem(600)};
    min-height: ${convertToRem(522)};
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-card-body {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .loading-description {
        font-style: normal;
        font-weight: normal;
        font-size: ${convertToRem(22)};
        line-height: ${convertToRem(26)};
        /* identical to box height */

        display: flex;
        align-items: center;
        margin: ${convertToRem(48)} 0;
        color: #585858;
      }

      .ant-spin-spinning span {
        font-size: ${convertToRem(44)} !important;
      }
    }
  }
`;
