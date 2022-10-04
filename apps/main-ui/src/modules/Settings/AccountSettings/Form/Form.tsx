import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Space,
  Checkbox,
  Switch,
} from 'antd';
import { FormLabel, ConfirmModal, BOLDTEXT, CommonModal } from '@components';
import { DivProps, IBaseAPIError, IErrorData } from '@invyce/shared/types';
import convertToRem from '../../../../utils/convertToRem';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import ReactInputVerificationCode from 'react-input-verification-code';
import { useMutation, useQuery } from 'react-query';
import {
  ChangeAccountPreferencesAPI,
  ChangeRequestOtpVerification,
  generateAuthenticator,
  updateAccountSetting,
  verifyAuthenticatorCode,
  userCheckAPI,
} from '../../../../api';
import dayjs from 'dayjs';
import { invycePersist } from '@invyce/invyce-persist';
import { updateToken } from '../../../../utils/http';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';

const defaultState = {
  email: false,
  password: false,
  twoStepAuth: false,
};

export const AccountsSettingsForm: FC = () => {
  const {
    mutate: verifyOTP,
    isLoading: verifyingOTP,
    isError,
    error,
    reset: resetVerifyingOPT,
  } = useMutation(ChangeRequestOtpVerification);
  const otpError: IBaseAPIError = error;
  const { mutate: requestChange, isLoading } = useMutation(
    ChangeAccountPreferencesAPI
  );
  const { mutate: requestQRCode, data } = useMutation(generateAuthenticator, {
    onSuccess: () => {
      setTwoFactorAuthModal(true);
    },
  });

  const { mutate: verifyAuthenticatorToken } = useMutation(
    verifyAuthenticatorCode
  );

  const { mutate: updateSetting, isLoading: updatingSetting } =
    useMutation(updateAccountSetting);
  const [editable, setEditable] = useState({
    email: false,
    password: false,
    twoStepAuth: false,
  });
  const [otpValue, setOtpValue] = useState('');
  const { userDetails, refetchUser, Colors } = useGlobalContext();
  const { email, twoFactorEnabled } = userDetails;
  const [twoFactorAuthModal, setTwoFactorAuthModal] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      email,
      twoFactorEnabled,
    });
  }, [userDetails]);

  const [form] = Form.useForm();
  // const [verified, setVerified] = useState(false);
  const [avaliablity, setAvaliablity] = useState({
    email: true,
  });

  const [verifyModal, setVerifyModal] = useState({
    visibility: false,
    type: null,
  });

  let timeOutTime: any;
  const setDangerousHTML = (html) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const { mutate: mutateUsernameAvaliable, data: usernameAvaliable } =
    useMutation(userCheckAPI);

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
              setAvaliablity({ email: false });
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

  const getVerifiedStatus = (type) => {
    const data = invycePersist().get(`${type}-request`, 'cookie');

    return data ? data : null;
  };

  const requestChangePreferences = async (type) => {
    const payload = {
      type,
    };
    await requestChange(payload, {
      onSuccess: (data) => {
        const nextFiveMins = dayjs().add(3, 'minutes');
        invycePersist(`${type}-request`, true, 'cookie', nextFiveMins).set();
        setVerifyModal({ visibility: true, type });
        resetVerifyingOPT();
      },
    });
  };

  const resetCookie = (type: 'email' | 'password') => {
    invycePersist().resetData(`${type}-request`, 'cookie');
  };

  const resetVerifyEmail = () => {
    resetCookie('email');
    resetVerifyingOPT();
    setEditable((prev) => {
      return { ...prev, email: null };
    });
  };

  const checkVerifyCode = async (otp, type) => {
    verifyOTP(
      { otp },
      {
        onSuccess: (data) => {
          setEditable({ ...defaultState, [type]: true });
          setVerifyModal({ visibility: false, type: null });
          invycePersist().resetData(`${type}-request`, 'cookie');
          setOtpValue('');
        },
      }
    );
  };

  const updateFormItem = async (formItem) => {
    if (formItem.email !== email) {
      await updateSetting(
        { ...formItem },
        {
          onSuccess: async (data) => {
            await updateToken(data?.data?.access_token);
            refetchUser();
            setEditable(defaultState);
          },

          onError: (error) => {
            console.log(error, 'error');
          },
        }
      );
    } else {
      setEditable(defaultState);
    }
  };

  const geterateQRCode = async () => {
    await requestQRCode();
  };

  const verifyAuthToken = async (code) => {
    await verifyAuthenticatorToken(
      { code },
      {
        onSuccess: (data) => {
          setTwoFactorAuthModal(false);
          refetchUser();
          setOtpValue('');
        },
      }
    );
  };

  console.log(avaliablity, 'ava');

  return (
    <WrapperSettingsForm>
      <Form form={form}>
        <FormLabel>Email</FormLabel>
        <div className="flex">
          <Form.Item
            style={{ width: 300 }}
            rules={[
              { type: 'email' },
              {
                validator: (rule, value, callback) => {
                  if (value === email) {
                    callback();
                  } else {
                    checkUsernameAvaliable({ email: value }, callback);
                  }
                },
              },
            ]}
            name="email"
            shouldUpdate
          >
            <Input
              autoComplete="off"
              disabled={!editable.email}
              size="middle"
            />
          </Form.Item>
          <Button
            onClick={() =>
              editable?.email
                ? updateFormItem({ email: form.getFieldValue('email') })
                : true && getVerifiedStatus('email')
                ? setVerifyModal({ visibility: true, type: 'email' })
                : requestChangePreferences('email')
            }
            size="middle"
            type="link"
            disabled={form.getFieldValue('email') === email && editable?.email}
          >
            {editable?.email
              ? 'Change'
              : getVerifiedStatus('email') && true
              ? 'Verify'
              : 'Request Change'}
          </Button>
          {editable?.email && (
            <Button onClick={resetVerifyEmail} type="link" danger>
              Cancel
            </Button>
          )}
          {getVerifiedStatus('email') && (
            <Button onClick={resetVerifyEmail} type="link" danger>
              Cancel
            </Button>
          )}
        </div>
        <FormLabel>Password</FormLabel>
        <div className="flex">
          <Form.Item
            style={{ width: 300 }}
            name="password"
            rules={[
              { required: true, message: 'Please add a password' },
              {
                min: 6,
                message: 'Your Password shold have minimum 6 characters',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              disabled={!editable.password}
              autoComplete="off"
              size="middle"
            />
          </Form.Item>
          {console.log(
            form.getFieldValue('email'),
            'form.getFieldValue',
            email
          )}
          <Button
            onClick={() =>
              editable?.password
                ? updateFormItem({ password: form.getFieldValue('password') })
                : true && getVerifiedStatus('password')
                ? setVerifyModal({ visibility: true, type: 'password' })
                : requestChangePreferences('password')
            }
            size="middle"
            type="link"
          >
            {editable?.password
              ? 'Change'
              : getVerifiedStatus('password') && true
              ? 'Verify'
              : 'Request Change'}
          </Button>
        </div>
        <div className="flex">
          <Form.Item
            style={{ width: 300 }}
            label="Two Factor Authentication"
            colon={false}
            name="twoFactorEnabled"
            valuePropName="checked"
            getValueFromEvent={(value) => {
              if (value === true) {
                geterateQRCode();
              } else {
                updateFormItem({ twoFactorEnabled: value });
              }
            }}
          >
            <Switch />
          </Form.Item>
        </div>
      </Form>
      {/* <Form
        onFinish={(value) => {
          console.log(value);
        }}
        onFinishFailed={(err) => {
          console.log(err);
        }}
        form={form}
      >
        <Row gutter={24}>
          <Col span={10}>
            <Row gutter={24}>
              <Col span={24}>
                <Heading type="form-inner" fontWeight="600">
                  Settings
                </Heading>
                <br />
              </Col>
              <Col span={24}>
                <FormLabel>Email Address</FormLabel>
                <Form.Item rules={[{ type: 'email' }]} name="email">
                  <Input
                    defaultValue={email}
                    disabled={!editable.email}
                    placeholder="something@example.com"
                    size="large"
                    onChange={(value) => {
                      form.setFieldsValue({ email: value });
                    }}
                  />

                  <p
                    onClick={() =>
                      editable?.email
                        ? form.submit()
                        : true && getVerifiedStatus('email')
                        ? setVerifyModal({ visibility: true, type: 'email' })
                        : requestChangePreferences('email')
                    }
                    className="changeText"
                  >
                    {editable?.email
                      ? 'Change'
                      : getVerifiedStatus('email') && true
                      ? 'Verify'
                      : 'Request Change'}
                  </p>

                  <br />
                </Form.Item>
              </Col>
              <Col span={24}>
                <FormLabel>Password</FormLabel>
                <Form.Item name="password">
                  {!editable.password ? (
                    <Input
                      size="large"
                      disabled={!editable.password}
                      type="password"
                    />
                  ) : (
                    <Input.Password size="large" />
                  )}
                  {!editable.password && (
                    <p
                      onClick={() =>
                        setEditable({ ...editable, password: true })
                      }
                      className="changeText"
                    >
                      Change
                    </p>
                  )}
                  <br />
                </Form.Item>
              </Col>
              <Col span={24}>
                <FormLabel>Two-Step-Authentication</FormLabel>
                <Form.Item name="twoStepAuth">
                  <Select
                    size="large"
                    disabled={!editable.twoStepAuth}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select a Country"
                    optionFilterProp="children"
                    onChange={(val) => console.log(val)}
                  >
                    <Option value="Pakistan">Activate</Option>
                    <Option value="China">Deactivate</Option>
                  </Select>

                  {!editable.twoStepAuth && (
                    <p
                      onClick={() =>
                        setEditable({ ...editable, twoStepAuth: true })
                      }
                      className="changeText"
                    >
                      Enable
                    </p>
                  )}
                  <br />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Heading type="form-inner" fontWeight="600">
                  Preferences
                </Heading>
                <br />
              </Col>
              <Col span={24}>
                <FormLabel>Two-Step-Authentication</FormLabel>
                <Form.Item name="logInto">
                  <Select
                    size="large"
                    showSearch
                    defaultValue={'1'}
                    style={{ width: '100%' }}
                    placeholder="Select a Country"
                    optionFilterProp="children"
                    onChange={(val) => console.log(val)}
                  >
                    <Option value="1">the organisation i was last in</Option>
                    <Option value="2">the organisation i was first in</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <div className="actions-wrapper">
                    <Button type="primary" htmlType="submit">
                      Update Preferences
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form> */}
      <ConfirmModal
        visible={verifyModal?.visibility}
        onCancel={() => {
          setVerifyModal({ visibility: false, type: null });
          setOtpValue('');
          resetVerifyingOPT();
        }}
        showButtons={false}
        type="info"
        confirmText="Verify"
        children={
          <WrapperOtpModal error={isError}>
            <p>
              Otp has been sent to <br /> <BOLDTEXT>{email}</BOLDTEXT> please
              verify!
            </p>
            <div className="flex alignCenter justifyCenter">
              <ReactInputVerificationCode
                value={otpValue}
                length={5}
                placeholder={'*'}
                onChange={(value) => {
                  setOtpValue(value);
                  const bool = value.includes('*');
                  if (value?.split('').length === 5 && !bool) {
                    checkVerifyCode(value, verifyModal?.type);
                  }
                }}
              />
            </div>
            {otpError?.response?.data?.message && (
              <p className="ant-form-item-explain mv-5">
                {otpError?.response?.data?.message}
              </p>
            )}

            <Button
              onClick={() => {
                requestChangePreferences(verifyModal?.type);
              }}
              type="link"
              size="small"
            >
              Resend OTP
            </Button>
          </WrapperOtpModal>
        }
      />
      <CommonModal
        width={350}
        visible={twoFactorAuthModal}
        footer={false}
        onCancel={() => {
          setTwoFactorAuthModal(false);
          setOtpValue('');
          form.setFieldsValue({ twoFactorEnable: false });
        }}
        title="Scan QR Code"
      >
        <WrapperOtpModal error={false}>
          <div className="flex justifyCenter">
            <img src={data?.data?.result} alt="qr-code" />
          </div>
          <div className="mv-10 flex justifyCenter">
            <ReactInputVerificationCode
              value={otpValue}
              length={6}
              placeholder={'*'}
              onChange={(value) => {
                setOtpValue(value);
                const bool = value.includes('*');
                if (value?.split('').length === 6 && !bool) {
                  verifyAuthToken(value);
                }
              }}
            />
          </div>
        </WrapperOtpModal>
      </CommonModal>
    </WrapperSettingsForm>
  );
};

export const WrapperSettingsForm = styled.div`
  .changeText {
    position: absolute;
    top: ${convertToRem(11)};
    right: ${convertToRem(10)};
    color: ${(props: IThemeProps) => props?.theme?.colors?.$PRIMARY};
    font-size: ${convertToRem(12)};
    font-weight: 400;
    text-transform: capitalize;
    cursor: pointer;
  }
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: center;
  }
`;

interface IWrrapper extends DivProps {
  error: boolean;
}

export const WrapperOtpModal = styled.div<IWrrapper>`
  .ReactInputVerificationCode__container {
    width: ${convertToRem(320)} !important;
  }
  .ReactInputVerificationCode__item {
    width: 3.4rem !important;
    height: 3.4rem !important;
    line-height: 4rem !important;
    margin: 1px;

    ${(props) => (props?.error ? `border: 1px solid red !important` : '')}
  }
`;
