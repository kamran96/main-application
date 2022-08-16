/* eslint-disable @typescript-eslint/no-var-requires */
import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import en from 'world_countries_lists/data/en/world.json';
import { RegisterAPI } from '../../api/auth';
import { userCheckAPI } from '../../api/users';
import { Heading } from '../../components/Heading';
import { BOLDTEXT } from '../../components/Para/BoldText';
import { Seprator } from '../../components/Seprator';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { IBaseAPIError, NOTIFICATIONTYPE } from '../../modal';
import { updateToken } from '../../utils/http';
import phoneCodes from '../../utils/phoneCodes';

const { Option } = Select;

let timeOutTime: any;

export const RegisterForm: FC = () => {
  const [show, setShow] = useState(true);
  const { mutate: mutateUsernameAvaliable, data: usernameAvaliable } =
    useMutation(userCheckAPI);
  const { mutate: mutateRegister, isLoading } = useMutation(RegisterAPI);
  const { handleLogin, notificationCallback } = useGlobalContext();

  const [avaliablity, setAvaliablity] = useState({
    username: false,
    email: false,
  });

  useEffect(() => {
    form.setFieldsValue({ prefix: `92` });
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('is here');
    try {
      await mutateRegister(values, {
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
          form.resetFields();
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'User Created');
        },
        onError: (error: IBaseAPIError) => {
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            const { message } = error.response.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, message);
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setDangerousHTML = (html) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const checkUsernameAvaliable = async (payload, callback) => {
    const request = payload;
    clearTimeout(timeOutTime);
    timeOutTime = setTimeout(async () => {
      await mutateUsernameAvaliable(
        { ...request },
        {
          onSuccess: (data) => {
            if (!data?.data?.available) {
              callback(setDangerousHTML(data?.data?.message));
            } else {
              const accessor = Object.keys(request)[0];
              setAvaliablity({ ...avaliablity, [accessor]: true });
              callback();
            }
          },
        }
      );
    }, 400);
  };

  const getFlag = (short: string) => {
    const data = require(`world_countries_lists/flags/24x24/${short.toLowerCase()}.png`);
    // for dumi
    if (typeof data === 'string') {
      return data;
    }
    // for CRA
    return data.default;
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 100 }}
        showSearch
        defaultValue={`92`}
        filterOption={(input, option) => {
          return (
            option?.id?.toLowerCase().includes(input?.toLocaleLowerCase()) ||
            option?.title?.toLowerCase().includes(input?.toLocaleLowerCase())
          );
        }}
      >
        {phoneCodes?.map((country) => {
          return (
            <Option
              value={`${country?.phoneCode}`}
              title={`${country?.phoneCode}`}
              id={`${country?.short}`}
            >
              <img
                className="mr-10"
                alt="flag"
                style={{ width: 18, height: 18, verticalAlign: 'sub' }}
                src={getFlag(country.short)}
              />
              <span>+{country?.phoneCode}</span>
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  return (
    <RegisterFormWrapper>
      <div className="form_body">
        <Row gutter={24}>
          <Col
            xxl={{ span: 19, offset: 5, pull: 4 }}
            xl={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <div className="personal_info">
              <div className="form_title">
                <Heading className="mb-20" type="table">
                  Register Your Account!
                </Heading>
                <p className="form_description">
                  Let’s get all set up so you can verify your personal account
                  and begin <br /> setting up your profile.{' '}
                </p>
                <Seprator />
              </div>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                form={form}
                validateTrigger={'onChange'}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        {
                          required: true,
                          message: 'Please add your first name',
                        },
                      ]}
                    >
                      <Input
                        placeholder={'e.g John'}
                        size="large"
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        { required: true, message: 'Username required' },
                        {
                          pattern: /^[a-zA-Z0-9_-]+$/,
                          message: 'Remove unnecessary characters',
                        },
                      ].concat(
                        avaliablity?.username
                          ? []
                          : [
                              {
                                validator: (rule, value, callback) => {
                                  checkUsernameAvaliable(
                                    { username: value },
                                    callback
                                  );
                                },
                              } as any,
                            ]
                      )}
                      hasFeedback
                    >
                      <Input
                        onChange={() => {
                          setAvaliablity({ ...avaliablity, username: false });
                        }}
                        placeholder="e.g John"
                        size="large"
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      validateFirst="parallel"
                      shouldUpdate
                      // rules={[
                      //   {
                      //     type: 'email',
                      //   },
                      //   {
                      //     required: true,
                      //     message: 'Please add your email',
                      //   },
                      // ]}
                      rules={[
                        { required: true, message: 'Please add your ' },
                        {
                          type: 'email',
                        } as any,
                      ].concat(
                        avaliablity?.username
                          ? []
                          : [
                              {
                                validator: (rule, value, callback) => {
                                  checkUsernameAvaliable(
                                    { email: value },
                                    callback
                                  );
                                },
                              } as any,
                            ]
                      )}
                      hasFeedback
                    >
                      <Input
                        placeholder="e.g someone@example.com"
                        size="large"
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="country"
                      rules={[{ required: true }]}
                      label="Country"
                    >
                      <Select
                        size="large"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select a Country"
                        filterOption={(input, option) => {
                          return option?.title
                            ?.toLowerCase()
                            .includes(input?.toLocaleLowerCase());
                        }}
                      >
                        {en?.map((country) => {
                          return (
                            <Option title={country?.name} value={country?.name}>
                              <img
                                className="mr-10"
                                alt="flag"
                                style={{
                                  width: 18,
                                  height: 18,
                                  verticalAlign: 'sub',
                                }}
                                src={getFlag(country.alpha2)}
                              />
                              <span>{country?.name}</span>
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Cell Number"
                      name="phoneNumber"
                      rules={[
                        {
                          required: false,
                          message: 'Please add your last name',
                        },
                        { max: 12, min: 4 },
                      ]}
                    >
                      <Input
                        autoComplete="off"
                        addonBefore={prefixSelector}
                        type="text"
                        placeholder="3188889898"
                        size="large"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please add a password' },
                        {
                          min: 6,
                          message:
                            'Your Password shold have minimum 6 characters',
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password autoComplete="off" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      className="m-reset"
                      name="agreed"
                      valuePropName="checked"
                    >
                      <Checkbox onChange={() => setShow(!show)}>
                        <span>
                          I have read and agree to the{' '}
                          <a
                            target="_blank"
                            href="https://invyce.com/terms-conditions/"
                            rel="noreferrer"
                          >
                            terms,{' '}
                          </a>
                          <a
                            target="_blank"
                            href="https://invyce.com/privacy-policy/"
                            rel="noreferrer"
                          >
                            Privacy,{' '}
                          </a>{' '}
                          and{' '}
                          <a
                            target="_blank"
                            href="https://invyce.com/cookie-policy/"
                            rel="noreferrer"
                          >
                            Cookie Policy{' '}
                          </a>
                        </span>
                      </Checkbox>
                    </Form.Item>
                    {/* <Form.Item name="update-details" valuePropName="checked">
                        <Checkbox>
                          Send me all the Marketing and Update details
                        </Checkbox>
                      </Form.Item> */}
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      <div className="actions-wrapper mt-20">
                        <Button
                          style={{ width: '100%' }}
                          loading={isLoading}
                          type="primary"
                          htmlType="submit"
                          disabled={show}
                          size="large"
                        >
                          Create Account
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
      <div className="already_accout textCenter">
        Already have an account?{' '}
        <Link to={`/page/login`}>
          <BOLDTEXT>Login</BOLDTEXT>
        </Link>
      </div>
    </RegisterFormWrapper>
  );
};

const RegisterFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 50px;
  align-item: center;
  height: 100vh;

  @media (max-height: 589px) {
    justify-content: space-between;
    height: auto !important;
    padding-top: 40px;
  }

  .ant-form-item-explain,
  .ant-form-item-extra {
    color: red !important;
  }
`;
