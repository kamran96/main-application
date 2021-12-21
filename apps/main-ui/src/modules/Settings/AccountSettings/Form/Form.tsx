import styled from 'styled-components';
import React, { FC, useState } from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { FormLabel } from '../../../../components/FormLabel';
import { Heading } from '../../../../components/Heading';
import { Color } from '../../../../modal';
import convertToRem from '../../../../utils/convertToRem';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

const { Option } = Select;

export const AccountsSettingsForm: FC = () => {
  const [editable, setEditable] = useState({
    email: false,
    password: false,
    twoStepAuth: false,
  });

  const { userDetails } = useGlobalContext();
  const { email } = userDetails;

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
                      onClick={() => setEditable({ ...editable, email: true })}
                      className="changeText"
                    >
                      Change
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
`;
