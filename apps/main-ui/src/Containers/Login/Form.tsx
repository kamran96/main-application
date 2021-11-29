import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Row, Col, Modal } from 'antd';
import { FormLabel } from '../../components/FormLabel';
import { useMutation } from 'react-query';
import { LoginAPI } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { updateToken } from '../../utils/http';
import { ISupportedRoutes, NOTIFICATIONTYPE } from '../../modal';
import { IBaseAPIError } from '../../modal/base';
import { HeadingTemplate1 } from '../../components/HeadingTemplates';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { Link } from 'react-router-dom';
import { BOLDTEXT } from '../../components/Para/BoldText';
import { CommonModal } from '../../components/Modal';

export const LoginForm: FC = () => {
  const [mutateLogin, responseMutateLogin] = useMutation(LoginAPI);

  const {
    notificationCallback,
    routeHistory,
    setAutherized,
    handleLogin,
  }: any = useGlobalContext();
  const { history } = routeHistory;

  const onFinish = async (values) => {
    try {
      await mutateLogin(values, {
        onSuccess: (data) => {
          if (process.env.NODE_ENV === 'production') {
            handleLogin({
              type: ILoginActions.LOGIN,
              payload: { autherization: true },
            });
          } else {
            handleLogin({
              type: ILoginActions.LOGIN,
              payload: data?.data,
            });
            updateToken(data?.data.access_token);
          }
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Logged in SuccessFully`
          );
        },
      });
    } catch (errorRes: IBaseAPIError | any) {
      if (errorRes && errorRes.response && errorRes.response.data) {
        const { message } = errorRes.response.data;
        notificationCallback(NOTIFICATIONTYPE.ERROR, `${message}`);
      } else {
        notificationCallback(
          NOTIFICATIONTYPE.ERROR,
          `Please check your internet connection`
        );
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //--------------------------------------------------------
 

  return (
    <LoginFormWrapper>
      <div className="login_wrapper">
        <Row gutter={24}>
          <Col
            xxl={{ span: 18, offset: 3 }}
            xl={{ span: 18, offset: 3 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <HeadingTemplate1
              title="Login to your account"
              paragraph={
                'Thank you for get back to Invyce, let access out the best recommendation for you'
              }
            />
          </Col>
        </Row>
        <Form
          autoComplete="off"
          className="mt-20"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={24}>
            <Col
              xxl={{ span: 18, offset: 3 }}
              xl={{ span: 18, offset: 3 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <FormLabel>Email/Username</FormLabel>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <FormLabel>Password</FormLabel>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password size="large" autoComplete="off" />
              </Form.Item>
              <div className="actions-wrapper mv-10">
                <Form.Item name="remember_me" valuePropName="checked">
                  <Checkbox>Remember Me</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  htmlType="button"
                  onClick={() =>
                    history?.push(
                      ISupportedRoutes.DEFAULT_LAYOUT +
                        ISupportedRoutes.FORGOT_PASSWORD
                    )
                  }
                >
                  Forgot Password?
                </Button>
              </div>
              <Form.Item className="m-reset">
                <Button
                  htmlType="submit"
                  style={{ width: '100%' }}
                  type="primary"
                  size="middle"
                  loading={responseMutateLogin.isLoading}
                >
                  Sign In
                </Button>
              </Form.Item>
              <h5 className="textCenter mt-10">
                <BOLDTEXT>OR</BOLDTEXT>
              </h5>
              <Form.Item className="m-reset">
                <Button
                  style={{ width: '100%' }}
                  type="default"
                  size="middle"
                  onClick={() => {
                    history?.push(
                      ISupportedRoutes?.DEFAULT_LAYOUT +
                        ISupportedRoutes?.SIGNUP
                    );
                  }}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        
      </div>
    </LoginFormWrapper>
  );
};



export const LoginFormWrapper = styled.div`
  .import-btn {
    font: normal 13px/123% Roboto;
    letter-spacing: 0.02em;
    color: #3e3e3c;
    padding: 8px 20px;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    cursor: pointer;
  }
  width: 100%;
  height: 100vh;
  padding: 0 90px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  .actions-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .join_link {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    text-align: center;
    background-color: white;
  }
`;
