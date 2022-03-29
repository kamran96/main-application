import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import InvyceLog from '../../assets/invyceLogo.png';
import LoginIllustration from '../../assets/forgot.png';
import { HeadingTemplate1 } from '../../components/HeadingTemplates';
import convertToRem from '../../utils/convertToRem';
import { useMutation } from 'react-query';
import { requestResetPasswordAPI } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { NOTIFICATIONTYPE } from '../../modal';

export const EmailForm: FC = () => {
  const {
    mutate: mutateRequestResetPassword,
    isSuccess,
    isLoading,
  } = useMutation(requestResetPasswordAPI);
  const { notificationCallback } = useGlobalContext();

  const onFinish = async (payload) => {
    await mutateRequestResetPassword(payload, {
      onSuccess: () => {
        notificationCallback(
          NOTIFICATIONTYPE.SUCCESS,
          `Reset link has been sent to your email please check`
        );
      },
    });
  };

  return (
    <WrapperEmailForm>
      <div className="illustration">
        <div className="invyce_logo">
          <img src={InvyceLog} alt={'invyce logo'} />
        </div>
        <h2 className="slogan">
          Forgot Your Password
          <br />
          Don't Worry We Got
          <br />
          You
        </h2>
        <div className="illustration_image">
          <img src={LoginIllustration} alt="illustration" />
        </div>
      </div>
      <div className="form_layout">
        <div className="form_wrapper">
          <Row gutter={24}>
            <Col
              xxl={{ span: 15, offset: 7, pull: 5 }}
              xl={{ span: 19, offset: 5, pull: 5 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <HeadingTemplate1
                title="Forgot Your Password"
                paragraph="Don’t worry, we got you please enter the email address associated with your account "
              />
              <Form onFinish={onFinish} className="_form" layout="vertical">
                <Form.Item
                  label="Email / Username"
                  name="username"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email' },
                  ]}
                  hasFeedback
                >
                  <Input size="large" autoComplete="off" />
                </Form.Item>
                <Form.Item hasFeedback={isSuccess ? true : false}>
                  <Button
                    loading={isLoading}
                    className="mt-10"
                    style={{ width: '100%' }}
                    size="large"
                    type="primary"
                    htmlType="submit"
                  >
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </WrapperEmailForm>
  );
};
const WrapperEmailForm = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  @media (min-width: 1366px) {
    .illustration {
      padding-left: ${convertToRem(125)} !important;
    }
  }
  .illustration {
    grid-column: 6 span;
    padding: ${convertToRem(44)} ${convertToRem(60)};
    background: #0071ff;
    height: 100vh;
    width: 100%;
    background-repeat: no-repeat;
    background-position: bottom right;
    .invyce_logo {
      padding-bottom: ${convertToRem(41)};
      img {
        width: ${convertToRem(117)};
      }
    }
    .slogan {
      font-style: normal;
      font-weight: 500;
      font-size: ${convertToRem(34)};
      line-height: ${convertToRem(51)};
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      text-transform: capitalize;

      color: #ffffff;
    }
    .illustration_image {
      text-align: center;
      img {
        max-width: 50%;
        height: auto;
        margin-top: ${convertToRem(70)};
      }
    }
  }
  .form_layout {
    grid-column: 6 span;
    padding: ${convertToRem(45)} ${convertToRem(90)};
    display: flex;
    align-items: center;
    .form_wrapper {
      width: 100%;
    }
    ._form {
      margin-top: ${convertToRem(40)};
    }
  }
`;
