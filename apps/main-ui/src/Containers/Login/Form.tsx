import { FC } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Row, Col, Checkbox } from 'antd';
import { FormLabel } from '../../components/FormLabel';
import { useMutation } from 'react-query';
import { googleLoginAPI, LoginAPI } from '../../api';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { updateToken } from '../../utils/http';
import { ISupportedRoutes, NOTIFICATIONTYPE } from '../../modal';
import { IBaseAPIError } from '../../modal/base';
import { HeadingTemplate1 } from '../../components/HeadingTemplates';
import { BOLDTEXT } from '../../components/Para/BoldText';
import GoogleLogin from 'react-google-login';

export const LoginForm: FC = () => {
  const { mutate: mutateLogin, isLoading: logginIn } = useMutation(LoginAPI);
  const { mutate: mutateGoogleLogin, isLoading: googleLoginLoading } =
    useMutation(googleLoginAPI);

  const { notificationCallback, routeHistory, handleLogin }: any =
    useGlobalContext();
  const { history } = routeHistory;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    await mutateLogin(values, {
      onSuccess: (data) => {
        // eslint-disable-next-line no-constant-condition
        if (process.env.NODE_ENV === 'production' || true) {
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
      onError: (errorRes: IBaseAPIError) => {
        if (errorRes.response.data) {
          if (errorRes?.response?.status === 404) {
            form.setFields([
              {
                name: 'username',
                value: values?.username,
                errors: [`${errorRes?.response?.data?.message}`],
              },
            ]);
          } else if (errorRes?.response?.status === 400) {
            form.setFields([
              {
                name: 'password',
                value: values?.password,
                errors: [`${errorRes?.response?.data?.message}`],
              },
            ]);
          } else {
            notificationCallback(
              NOTIFICATIONTYPE.ERROR,
              `${errorRes?.response?.data?.message}`
            );
          }
        } else {
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            `Please check your internet connection`
          );
        }
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //--------------------------------------------------------

  const submitGoogleLogin = async (token?: string) => {
    await mutateGoogleLogin(
      { token },
      {
        onSuccess: (data) => {
          // eslint-disable-next-line no-constant-condition
          if (true || process.env.NODE_ENV === 'production') {
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
      }
    );
  };

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
          form={form}
          className="mt-20"
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
                <Input size="large" autoComplete="off" />
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
                {/* <Form.Item name="remember_me" valuePropName="checked">
                  <Checkbox>Remember Me</Checkbox>
                </Form.Item> */}
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
                  size="large"
                  loading={logginIn}
                >
                  Sign In
                </Button>
              </Form.Item>
              <Form.Item>
                <GoogleLogin
                  className="google-signin mv-10"
                  clientId={`739410132871-45r2feessjs5l5rtbk1kekr5t78aa7ee.apps.googleusercontent.com`}
                  buttonText="Log in with Google"
                  onSuccess={(data: any) => {
                    const { tokenId } = data;

                    submitGoogleLogin(tokenId);
                  }}
                  onFailure={(err) => {
                    console.log(err);
                  }}
                  cookiePolicy={'single_host_origin'}
                />
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
    button {
      padding: 0;
    }
  }

  .join_link {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    text-align: center;
    background-color: white;
  }

  .google-signin {
    justify-content: center;
    width: 100%;
    box-shadow: 0px 2px 5px 1px #e4e4e4 !important;
  }
`;
