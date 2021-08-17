import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { FC } from "react";
import styled from "styled-components";
import InvyceLog from "../../assets/invyceLogo.png";
import ResetIllustration from "../../assets/resetPassword.png";
import { HeadingTemplate1 } from "../../components/HeadingTemplates";
import convertToRem from "../../utils/convertToRem";
import { useMutation } from "react-query";
import { resetPasswordAPI } from "../../api";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { ISupportedRoutes, NOTIFICATIONTYPE } from "../../modal";

export const ResetForm: FC = () => {
  const [mutateResetPassword, resResetRequest] = useMutation(resetPasswordAPI);
  const { notificationCallback } = useGlobalContext();
  const [form] = Form.useForm();
  const { routeHistory } = useGlobalContext();
  const {history} = routeHistory;
  const { location } =history;

  const onFinish = async (payload) => {
    let code = location?.search?.split("code=")[1].split("&")[0];
    await mutateResetPassword(
      { ...payload, code },
      {
        onSuccess: () => {
          notificationCallback(
            NOTIFICATIONTYPE.SUCCESS,
            `Your Password is Successfully Reset`
          );
          history?.push(`${ISupportedRoutes?.DEFAULT_LAYOUT}${ISupportedRoutes.LOGIN}`)
        },
      }
    );
  };

  return (
    <WrapperEmailForm>
      <div className="illustration">
        <div className="invyce_logo">
          <img src={InvyceLog} alt={"invyce logo"} />
        </div>
        <h2 className="slogan">
          Enter New Password
          <br />
          And Than Repeat
          <br />
          It
        </h2>
        <div className="illustration_image">
          <img src={ResetIllustration} alt="illustration" />
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
                title="Create New Password"
                paragraph="Please enter new and confirm password so next time you can’t forget"
              />
              <Form
                form={form}
                onFinish={onFinish}
                className="_form"
                layout="vertical"
              >
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter Password" },
                    {
                      min: 6,
                      message: "Your Password shold have minimum 6 characters",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password size="middle" />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: "Please re-type Password" },
                    {
                      validator: async (rule, value, callback) => {
                        console.log(form.getFieldValue("password") !== value);
                        if (value !== form.getFieldValue("password")) {
                          throw new Error(`Password is not matched`);
                        }
                      },
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password size="middle" />
                </Form.Item>
                <Form.Item
                  hasFeedback={resResetRequest?.isSuccess ? true : false}
                >
                  <Button
                    loading={resResetRequest?.isLoading}
                    className="mt-10"
                    style={{ width: "100%" }}
                    size="middle"
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
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
