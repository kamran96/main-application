import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import CommonModal from '../Modal';
import ReactInputVerificationCode from 'react-input-verification-code';
import { Button, Form } from 'antd';
import convertToRem from '../../utils/convertToRem';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { resendVerificationCodeAPI, verifyAccountAPI } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { IErrorMessages, IServerError, NOTIFICATIONTYPE } from '../../modal';
import { useState } from 'react';

export const VerificationModal: FC = () => {
  const queryCache = useQueryClient();
  const {
    userDetails,
    notificationCallback,
    setVerifiedModal,
    verifiedModal,
    refetchUser,
  } = useGlobalContext();
  const { email } = userDetails;
  const [form] = Form.useForm();
  const { mutate: muateteVerify, isLoading: verifyingAccount } =
    useMutation(verifyAccountAPI);
  const { mutate: mutateResendOtp, isLoading: resendingVerificationCode } =
    useMutation(resendVerificationCodeAPI);

  const [{ message, hasError }, setHasErrors] = useState({
    message: '',
    hasError: false,
  });

  const closeVerifyModal = () => {
    setVerifiedModal(false);
  };

  const onFinish = async (payload) => {
    const otp = parseInt(payload?.otp);
    await muateteVerify(
      { otp, email },
      {
        onSuccess: (data) => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Verified SuccessFully`
          );
          refetchUser();
          closeVerifyModal();
          form.resetFields();
        },
        onError: (err: IServerError) => {
          if (err?.response?.data?.message) {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              `${err?.response?.data?.message}`
            );
            setHasErrors({
              message: err?.response?.data?.message,
              hasError: true,
            });
          } else {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              `${IErrorMessages.NETWORK_ERROR}`
            );
          }
        },
      }
    );
  };

  const onResendOTP = async () => {
    await mutateResendOtp(
      { email },
      {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Verification Code is sent at ${email}`
          );
          form.resetFields();
        },
        onError: (err: IServerError) => {
          if (err?.response?.data?.message) {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              `${err?.response?.data?.message}`
            );
          } else {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              `${IErrorMessages.NETWORK_ERROR}`
            );
          }
        },
      }
    );
  };

  return (
    <CommonModal
      title={false}
      visible={verifiedModal}
      footer={false}
      width={369}
      onCancel={closeVerifyModal}
    >
      <WrapperModalBody isError={hasError}>
        <Form onFinish={onFinish} form={form}>
          <h4 className="title textCenter">Verify Your Account</h4>
          <p className="description textCenter">
            Enter the verification code we send to your account
          </p>
          <Form.Item name="otp">
            <ReactInputVerificationCode
              length={5}
              placeholder={'*'}
              onChange={(value) => {
                const bool = value.split('')[0]?.includes('*');
                if (hasError && bool) {
                  setHasErrors({ message: '', hasError: false });
                }
                form.setFieldsValue({ otp: value });
              }}
            />
            <p className="error textCenter">{message}</p>
          </Form.Item>
          <p className="resend_code textCenter">
            Didn’t get the code?&nbsp;
            <span onClick={onResendOTP} className="resend_link">
              Resend
            </span>
          </p>
          <Form.Item className="textCenter">
            <Button
              loading={verifyingAccount}
              className="mt-20 submit-button"
              type="primary"
              size="middle"
              htmlType="submit"
            >
              {'  '}Verify{'  '}
            </Button>
          </Form.Item>
        </Form>
      </WrapperModalBody>
    </CommonModal>
  );
};

export default VerificationModal;

const shake = keyframes`
 10% {
    transform: translate3d(-1px, 0, 0);
  }
  20% {
    transform: translate3d(2px, 0, 0);
  }
  30% {
    transform: translate3d(-4px, 0, 0);
  }
  40% {
    transform: translate3d(4px, 0, 0);
  }
  50% {
    transform: translate3d(-4px, 0, 0);
  }
  60% {
    transform: translate3d(4px, 0, 0);
  }
  70% {
   transform: translate3d(-4px, 0, 0);
 }
 80% {
  transform: translate3d(2px, 0, 0);
}
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  


`;

interface IWrapperModalBodyProps {
  isError: boolean;
}

const WrapperModalBody = styled.div<IWrapperModalBodyProps>`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px;

  h4.title {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 32px;
    /* identical to box height, or 133% */

    text-transform: capitalize;

    color: #192a3e;
  }
  .description {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    /* or 137% */

    color: #2d4155;
    margin: 8px 0;
  }

  .resend_code {
    margin: 8px 0;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;

    /* Text / main */

    color: #292731;
    span {
      color: #1890ff;
      font-weight: 500;
      cursor: pointer;
    }
  }
  .css-10g6fhb {
    width: ${convertToRem(280)} !important;
  }

  .ReactInputVerificationCode__item {
    width: 3rem !important;
    height: 4rem !important;
    line-height: 4rem !important;
  }

  /* animation: ${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both; */
  ${(props: any) =>
    props?.isError
      ? `
  .ReactInputVerificationCode__item{
      box-shadow: inset 0 0 0 1px #ff0404 !important;
  }
  
  `
      : ``}

  .submit-button {
    width: 180px;
  }

  p.error {
    margin: 0;
    color: red;
    font-size: 10px;
    margin-top: 5px;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;
