import React, { FC, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Form, Row, Col, Input, Checkbox, Button, message } from "antd";
import { Select } from "antd";
import { Link } from "react-router-dom";
import { FormLabel } from "../../components/FormLabel";
import { useMutation } from "react-query";
import { RegisterAPI } from "../../api/auth";
import { updateToken } from "../../utils/http";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { ILoginActions } from "../../hooks/globalContext/globalManager";
import { DivProps, IBaseAPIError, NOTIFICATIONTYPE } from "../../modal";
import { Heading } from "../../components/Heading";
import { Seprator } from "../../components/Seprator";
import en from "../../../../../node_modules/world_countries_lists/data/en/world.json";
import phoneCodes from "../../utils/phoneCodes";
import { BOLDTEXT } from "../../components/Para/BoldText";
import Icon from "@iconify/react";
import arrowLeft from "@iconify-icons/fe/arrow-left";

const { Option } = Select;

export const RegisterForm: FC = () => {
  const [step, setStep] = useState(1);

  const [mutateRegister, responseRegister] = useMutation(RegisterAPI);
  const { data, isLoading } = responseRegister;
  const { handleLogin, notificationCallback, setUserDetails } =
    useGlobalContext();

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      updateToken(result.access_token);
      setUserDetails(result.users);
      handleLogin({ type: ILoginActions.LOGIN, payload: result });
    }
  }, [data, handleLogin, setUserDetails]);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await mutateRegister(values, {
        onSuccess: () => {
          form.resetFields();
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            "User Created",
            `User Registration Completed`
          );
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
    } catch (error) {}
  };

  const onVerification = (values) => {
    setStep(1);
    console.log(values);
  };

  const getFlag = (short: string) => {
    const data = require(`world_countries_lists/flags/24x24/${short.toLowerCase()}.png`);
    // for dumi
    if (typeof data === "string") {
      return data;
    }
    // for CRA
    return data.default;
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 100 }}
        showSearch
        defaultValue={92}
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
              value={country?.phoneCode}
              title={`${country?.phoneCode}`}
              id={country?.short}
            >
              <img
                className="mr-10"
                alt="flag"
                style={{ width: 18, height: 18, verticalAlign: "sub" }}
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
    <RegisterFormWrapper step={step}>
      <div className="form_body">
        <div className="form_wrapper">
          <Row gutter={24}>
            <Col xxl={{ span: 19, offset: 5,pull: 4 }} xl={{span:24}} md={{span:24}} sm={{span:24}} xs={{span:24}}>
              <div className="personal_info">
                <div className="form_title">
                  <Heading className="mb-20" type="table">
                    Register Your Account!
                  </Heading>
                  <p className="form_description">
                    Let’s get all set up so you can verify your personal account
                    and begin <br /> setting up your profile.{" "}
                  </p>
                  <Seprator />
                </div>
                <Form
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="fullName"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: "Please add your first name",
                          },
                        ]}
                      >
                        <Input placeholder={"eg John"} size="middle" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                          { required: true, message: "please add username" },
                        ]}
                      >
                        <Input placeholder="e.g John" size="middle" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Please add your email" },
                        ]}
                      >
                        <Input
                          placeholder="e.g someone@example.com"
                          size="middle"
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
                          size="middle"
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Select a Country"
                          filterOption={(input, option) => {
                            return option?.title
                              ?.toLowerCase()
                              .includes(input?.toLocaleLowerCase());
                          }}
                        >
                          {en?.map((country) => {
                            return (
                              <Option title={country?.name} value={country?.id}>
                                <img
                                  className="mr-10"
                                  alt="flag"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    verticalAlign: "sub",
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
                            message: "Please add your last name",
                          },
                          { max: 12, min: 4 },
                        ]}
                      >
                        <Input
                          addonBefore={prefixSelector}
                          type="text"
                          placeholder="3188889898"
                          size="middle"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                          { required: true, message: "Please add a password" },
                          {
                            min: 6,
                            message:
                              "Your Password shold have minimum 6 characters",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password size="middle" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        className="m-reset"
                        name="agreed"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          <span>
                            I have read and agree to the <Link target="_blank" to="https://invyce.com/terms-conditions/">terms, </Link>
                            <Link target="_blank" to="https://invyce.com/privacy-policy/">Privacy, </Link> and{" "}
                            <Link target="_blank" to="https://invyce.com/cookie-policy/">Cookie Policy </Link>
                          </span>
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        name="update-details"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          Send me all the Marketing and Update details
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <div className="actions-wrapper">
                          <Button
                            style={{ width: "100%" }}
                            loading={isLoading}
                            type="primary"
                            htmlType="submit"
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

          {/* <div className="verification">
            <Row gutter={24}>
              <Col span={14}>
                <div className="form_title">
                  <Heading className="mb-20" type="table">
                    Complete Your Profile!
                  </Heading>
                  <p className="form_description">
                    For the purpose of software regulation, your details
                    <br /> are required
                  </p>
                  <Seprator />
                </div>
                <Form onFinish={onVerification}>
                  <h5>
                    <BOLDTEXT>Please verify account</BOLDTEXT>
                  </h5>
                  <p>
                    Please enter the verification code we sent
                    <br />
                    to your email
                  </p>
                  <Form.Item
                    name="code"
                    rules={[{ required: true, message: "Code is required!" }]}
                    hasFeedback
                  >
                    <Input size="middle" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="link" ghost>
                      Resend again?
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType={"submit"}>
                      Save & Continue
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
         */}
        </div>
        <div className="already_account pb-10 textCenter">
          Already have an account?{" "}
          <Link to={`/page/login`}>
            <BOLDTEXT>Login</BOLDTEXT>
          </Link>
        </div>
      </div>
    </RegisterFormWrapper>
  );
};

interface IRegisterFormWrapperProps extends DivProps{
  step: Number
}

const RegisterFormWrapper = styled.div<IRegisterFormWrapperProps>`
  .form_header {
    padding: 30px 20px 0 20px;
    top: 0;
    position: sticky;
    background-color: #ffffff;

    .step_info .values {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      display: flex;
      align-items: center;
      text-align: right;

      color: #bdbdbd;
    }
  }
  .form_body {
    padding: 135px 70px 0 70px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: calc(100vh - 75px);

    .form_wrapper {
      position: relative;
    }

    .personal_info {
      position: absolute;
      width: 100%;
      top: 0;
      transition: ${(props: any) => (props?.step === 1 ? "0.5s" : "0.9s")} all
        ease-in-out;
      opacity: ${(props: any) => (props?.step === 1 ? "1" : "0")};
    }
    .verification {
      position: absolute;
      width: 100%;
      top: 0;
      transition: ${(props: any) => (props?.step === 2 ? "0.9s" : "0.5s")} all
        ease-in-out;
      opacity: ${(props: any) => (props?.step === 2 ? "1" : "0")};
      z-index: ${(props: any) => (props?.step === 2 ? "1" : "-1")};
    }

    .form_title {
      padding-bottom: 70px;
    }

    .form_description {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
      /* or 125% */

      display: flex;
      align-items: center;

      color: #2d4155;
    }
  }
`;
