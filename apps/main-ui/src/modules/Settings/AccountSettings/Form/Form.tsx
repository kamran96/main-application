import styled from 'styled-components';
import { FC, useState } from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { FormLabel } from '../../../../components/FormLabel';
import { Heading } from '../../../../components/Heading';
import { Color } from '../../../../modal';
import convertToRem from '../../../../utils/convertToRem';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import ReactInputVerificationCode from 'react-input-verification-code';
import { BOLDTEXT } from '../../../../components/Para/BoldText';
import { useMutation, useQuery } from 'react-query';
import { ChangeAccountPreferencesAPI, verifyAccountAPI } from '../../../../api';
import dayjs from 'dayjs';
import { invycePersist } from '@invyce/invyce-persist';

const { Option } = Select;

const defaultState = {
  email: false,
  password: false,
  twoStepAuth: false,
};

export const AccountsSettingsForm: FC = () => {
  const [editable, setEditable] = useState({
    email: false,
    password: false,
    twoStepAuth: false,
  });
  // const [verified, setVerified] = useState(false);
  const [verifyModal, setVerifyModal] = useState({
    visibility: false,
    type: null,
  });

  const { mutate: verifyOTP, isLoading: verifyingOTP } =
    useMutation(verifyAccountAPI);

  const getVerifiedStatus = (type) => {
    const data = invycePersist().get(`${type}-request`, 'cookie');

    return data ? data : null;
  };

  const { mutate: requestChange, isLoading } = useMutation(
    ChangeAccountPreferencesAPI
  );

  const { userDetails } = useGlobalContext();
  const { email } = userDetails;

  const requestChangePreferences = async (type) => {
    const payload = {
      type,
    };
    await requestChange(payload, {
      onSuccess: (data) => {
        const nextFiveMins = dayjs().add(5, 'minutes');
        console.log(nextFiveMins, 'next');
        invycePersist(`${type}-request`, true, 'cookie', nextFiveMins).set();

        setVerifyModal({ visibility: true, type });
      },
    });
  };

  const checkVerifyCode = async (otp, type) => {
    console.log(otp, type);
  };

  return (
    <WrapperSettingsForm>
      <Form>
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
                <Form.Item name="email">
                  <Input
                    defaultValue={email}
                    disabled={!editable.email}
                    placeholder="something@example.com"
                    size="large"
                  />
                  {!editable.email && (
                    <p
                      onClick={() =>
                        editable?.email
                          ? null
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
                  )}
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
      </Form>
      <ConfirmModal
        visible={verifyModal?.visibility}
        onCancel={() => {
          setVerifyModal({ visibility: false, type: null });
        }}
        showButtons={false}
        type="info"
        confirmText="Verify"
        children={
          <WrapperOtpModal>
            <p>
              Otp has been sent to <br /> <BOLDTEXT>kamran@invyce.com</BOLDTEXT>{' '}
              please verify!
            </p>
            <div className="flex alignCenter justifyCenter">
              <ReactInputVerificationCode
                length={4}
                placeholder={'*'}
                onChange={(value) => {
                  const bool = value.includes('*');
                  if (value?.split('').length === 4 && !bool) {
                    checkVerifyCode(value, verifyModal?.type);
                  }
                }}
              />
            </div>
          </WrapperOtpModal>
        }
      />
    </WrapperSettingsForm>
  );
};

export const WrapperSettingsForm = styled.div`
  .changeText {
    position: absolute;
    top: ${convertToRem(11)};
    right: ${convertToRem(10)};
    color: ${Color.$PRIMARY};
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

export const WrapperOtpModal = styled.div`
  .ReactInputVerificationCode__container {
    width: ${convertToRem(200)} !important;
  }
  .ReactInputVerificationCode__item {
    width: 3rem !important;
    height: 4rem !important;
    line-height: 4rem !important;
  }
`;
