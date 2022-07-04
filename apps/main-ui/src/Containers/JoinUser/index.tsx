import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { Select, Checkbox, Form, Input, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Heading } from '../../components/Heading';
import { JoinUserIllustration } from '../../assets/icons';
import checkIcon from '@iconify-icons/feather/check';
import Icon from '@iconify/react';
import convertToRem from '../../utils/convertToRem';
import { VerifyUser } from './VerifyUser';
import { useMutation } from 'react-query';
import {
  userCheckAPI,
  userJoinAPI,
  verifyUserInvitationAPI,
} from '../../api/users';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { useState } from 'react';
import { updateToken } from '../../utils/http';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import {
  DivProps,
  IBaseAPIError,
  ISupportedRoutes,
  IUser,
  NOTIFICATIONTYPE,
} from '../../modal';
import { Capitalize } from '../../components/Typography';

const { Option } = Select;

let setTimeoutTime: any;

const InvyceFeatures = [
  'Easy create invoices',
  'Mange accounts',
  'Analyze business insights',
  'Mange contacts',
  'Manage inventory & sales',
  'Create & send quotations',
  'Import data from other accounting software',
];

export const JoinUser: FC = () => {
  const {
    mutate: mutateVerify,
    isLoading: verifyingUser,
    data: responseVerify,
  } = useMutation(verifyUserInvitationAPI);
  const {
    mutate: mutateUsernameAvaliable,
    data: responseUsernameAvaliable,
    isLoading: usernameChecking,
  } = useMutation(userCheckAPI);
  const {
    mutate: mutateJoinUser,
    data: resMutateUser,
    isLoading: joiningUser,
  } = useMutation(userJoinAPI);
  const [verified, setVerified] = useState(false);
  const [validatingStatus, setValidatingStatus] = useState('');
  const verifiedUser: IUser = responseVerify?.data?.result;

  const { setUserDetails, handleLogin, notificationCallback }: any =
    useGlobalContext();

  const [form] = Form.useForm();

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const { search } = history?.location;

  useEffect(() => {
    if (search) {
      const payload = {
        code: search?.split('code=')[1],
      };

      mutateVerify(payload, {
        onSuccess: (data) => {
          const { result } = data?.data;
          setVerified(true);
          const formValues = {
            username: '',
            email: result?.email,
            role: result?.role?.name,
            passowrd: '',
            branch: result?.branch?.name,
          };
          form?.setFieldsValue(formValues);
        },
        onError: (err: IBaseAPIError) => {
          if (err?.response?.data?.message) {
            const { message } = err?.response?.data;
            notificationCallback(NOTIFICATIONTYPE.ERROR, message);
            history?.push(`/page/login`);
          }
        },
      });
    }
  }, [search]);

  const onFinish = async (value) => {
    const { id } = responseVerify?.data?.result;
    await mutateJoinUser(
      { ...value, id },
      {
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
            'User Registered Successfully'
          );
        },
        onError: (err: IBaseAPIError) => {
          if (err?.response?.data?.message) {
            const { message } = err?.response?.data;
            notificationCallback(NOTIFICATIONTYPE.SUCCESS, message);
          }
        },
      }
    );
  };

  const onChangeUsername = (e) => {
    const value = e?.target?.value;
    clearTimeout(setTimeoutTime);
    setTimeoutTime = setTimeout(async () => {
      await mutateUsernameAvaliable(
        { username: value },
        {
          onSuccess: (data) => {
            //  form.setFields([{name: 'username', value: value, validating: true, errors: ['error']}  ])
          },
        }
      );
    }, 500);
  };

  return (
    <WrapperJoinUser verified={verified}>
      <div className="loader">
        <VerifyUser />
      </div>
      <div className="flex form-wrapper">
        <div className="illustration-area">
          <Row gutter={24}>
            <Col span={18} offset={3} className="custom-col-join-user">
              <div className="illustration textCenter">
                <JoinUserIllustration width={490} />
              </div>
              <div className="responsibilities mt-20">
                <h2 className="title">
                  Wellcome to{' '}
                  <Capitalize> {verifiedUser?.organization?.name}</Capitalize>
                </h2>
                <h4 className="sub-heading">Invyce lets you</h4>
                <ul>
                  {InvyceFeatures?.map((item, index) => {
                    return (
                      <li key={index}>
                        <Icon icon={checkIcon} /> {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="form-wrapper">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <h4 className="form-heading">Wellcome to Uconnect</h4>
            <p className="form-description"></p>
            <Form.Item
              label="Name"
              name="fullName"
              rules={[{ required: true, message: 'Name is required!' }]}
            >
              <Input size="middle" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="User Name"
              name="username"
              rules={[{ required: true, message: 'username is required!' }, {}]}
            >
              <Input
                onChange={onChangeUsername}
                size="middle"
                placeholder="Username"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'email is required!' },
                { type: 'email' },
              ]}
            >
              <Input disabled size="middle" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'country is required!' }]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a Country"
                optionFilterProp="children"
              >
                <Option value="pakistan">Pakistan</Option>
                <Option value="china">China</Option>
                <Option value="america">America</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'email is required!' }]}
            >
              <Input disabled size="middle" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: 'email is required!' }]}
            >
              <Input disabled size="middle" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: 'phone number is required!' }]}
            >
              <Input
                size="middle"
                placeholder="Phone Number"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'password is required!' }]}
            >
              <Input.Password size="large" autoComplete="off" />
            </Form.Item>
            <Form.Item name="agreed" valuePropName="checked">
              <Checkbox>
                <span>
                  I have read and agree to the{' '}
                  <Link
                    to="https://invyce.com/terms-conditions/"
                    target="_blank"
                  >
                    terms,{' '}
                  </Link>
                  <Link to="https://invyce.com/privacy-policy/" target="_blank">
                    Privacy,{' '}
                  </Link>{' '}
                  and{' '}
                  <Link target="_blank" to="https://invyce.com/cookie-policy/">
                    Cookie Policy
                  </Link>
                </span>
              </Checkbox>
            </Form.Item>
            <Form.Item name="update-details" valuePropName="checked">
              <Checkbox>Send me all the Marketing and Update details</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="middle" htmlType="submit">
                Create a account
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </WrapperJoinUser>
  );
};

interface IJoinUserWrapperProps extends DivProps {
  verified: boolean;
}

const WrapperJoinUser = styled.div<IJoinUserWrapperProps>`
  background: #f8fcff;
  position: relative;
  /* height: 100vh; */
  min-height: 100vh;

  .loader {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transition: 0.4s all ease-in-out;
    z-index: ${(props: any) => (props?.verified ? -1 : 30)};
  }

  .illustration-area {
    flex: 60%;
    padding: ${convertToRem(40)} 0;
    background: #f8fcff;
    min-height: 100vh;

    .responsibilities {
      .title {
        font-weight: 500;
        font-size: ${convertToRem(48)};
        line-height: ${convertToRem(63)};
        align-items: center;
        margin: 0;
        color: #000000;
      }
      .sub-heading {
        align-items: center;
        letter-spacing: 0.08em;
        color: #757575;
        font-size: ${convertToRem(24)};
        font-weight: normal;
        margin: ${convertToRem(16)} 0;
      }

      ul {
        list-style: none;
        padding: 0;
        li {
          font-style: normal;
          font-weight: normal;
          font-size: ${convertToRem(18)};
          line-height: ${convertToRem(21)};
          margin: ${convertToRem(8)} 0;
          display: flex;
          align-items: center;
          color: #4f4f4f;
          svg {
            color: #29abe2;
            margin-right: ${convertToRem(16)};
            font-size: ${convertToRem(20)};
            g {
              stroke-width: 3px;
            }
          }
        }
      }
    }
  }

  .form-wrapper {
    flex: 40%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .form-heading {
      font-weight: 600;
      font-size: ${convertToRem(22)};
      line-height: ${convertToRem(30)};
      /* identical to box height */

      display: flex;
      align-items: center;

      color: #000000;
    }
    .form-description {
      font-weight: normal;
      font-size: ${convertToRem(16)};
      line-height: ${convertToRem(19)};
      display: flex;
      align-items: center;
      text-align: center;
      margin: 0;
      color: #4a4a4a;
    }

    label::before {
      display: none !important;
    }
  }
`;
