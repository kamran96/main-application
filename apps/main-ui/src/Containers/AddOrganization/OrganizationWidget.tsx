import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { queryCache, useMutation } from 'react-query';
import styled from 'styled-components';
import en from 'world_countries_lists/data/en/world.json';
import { addOrganizationAPI } from '../../api/organizations';
import InvyceLog from '../../assets/invyceLogo.png';
import OrgIllustration from '../../assets/organization.png';
import { DatePicker } from '../../components/DatePicker';
import { HeadingTemplate1 } from '../../components/HeadingTemplates';
import { BOLDTEXT } from '../../components/Para/BoldText';
import { Seprator } from '../../components/Seprator';
import { UploadAtachment } from '../../components/UploadAtachment';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { ILoginActions } from '../../hooks/globalContext/globalManager';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { ISupportedRoutes } from '../../modal';
import { updateToken } from '../../utils/http';
import phoneCodes from '../../utils/phoneCodes';

const { Option } = Select;

export const OrganizationWidget: FC = () => {
  const { handleLogin, routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  const [mutateOrganization, { isLoading }] = useMutation(addOrganizationAPI);
  const [form] = Form.useForm();
  const getFlag = (short: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data: any = require(`world_countries_lists/flags/24x24/${short.toLowerCase()}.png`);
    // for dumi
    if (typeof data === 'string') {
      return data;
    }
    // for CRA
    return data.default;
  };

  const onFinish = async (values) => {
    await mutateOrganization(values, {
      onSuccess: async (data) => {
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
        ['loggedInUser', 'all-organizations', 'roles-permissions']?.forEach(
          (key) => {
            queryCache?.invalidateQueries((q) =>
              q?.queryKey[0].toString().startsWith(key)
            );
          }
        );

        history?.push(
          `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.DASHBOARD}`
        );
      },
    });
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
    <OrganizationWidgetWrapper>
      <div className="illustration">
        <div className="invyce_logo">
          <img src={InvyceLog} alt={'invyce logo'} />
        </div>
        <h2 className="slogan">
          Need more few
          <br />
          clicks for adding
          <br />
          your organization
        </h2>
        <div className="illustration_image">
          <img src={OrgIllustration} alt="illustration" />
        </div>
      </div>
      <div className="form">
        <HeadingTemplate1
          title="Add your organization"
          paragraph="Thank you for get back to Invyce, please add your organization details"
        />
        <Form onFinish={onFinish} form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name of Organization?"
                rules={[
                  { required: true, message: 'Organization Name is required!' },
                ]}
              >
                <Input size="middle" placeholder="e.g Abc pvt ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email?"
                rules={[{ required: true, message: 'Email is required!' }]}
              >
                <Input size="middle" placeholder="abce@domain.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="faxNumber"
                label="Fax No"
                rules={[{ required: false, message: 'Fax is required!' }]}
              >
                <Input size="middle" placeholder="Enter your fax number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: false, message: 'Please add your last name' },
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
              <Form.Item name="website" label="Website">
                <Input size="middle" placeholder="Website link" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Address Details</BOLDTEXT>
              </h3>
              <Seprator />
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
                      <Option title={country?.name} value={country?.id}>
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
              <Form.Item name="city" label="City">
                <Input size="middle" placeholder="New York" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="postalCode" label="Area Code">
                <Input size="middle" placeholder="8898" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Financial details</BOLDTEXT>
              </h3>
              <Seprator />
            </Col>
            <Col span={12}>
              <Form.Item name="financialEnding" label="Financial Year Ends">
                <DatePicker
                  style={{ width: '100%' }}
                  size="middle"
                  picker={'month'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <h3>
                <BOLDTEXT>Organization Logo</BOLDTEXT>
              </h3>
              <Seprator />
            </Col>
            <Col span={12}>
              <Form.Item name="attachmentId">
                <UploadAtachment
                  onUploadSuccess={(id) => {
                    form.setFieldsValue({ attachmentId: id });
                  }}
                  //   defaultValue={attachmentData}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item className="mt-20 ">
                <Button
                  loading={isLoading}
                  type="primary"
                  size="middle"
                  htmlType="submit"
                >
                  {' '}
                  &nbsp;&nbsp;Create Organization&nbsp;&nbsp;
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </OrganizationWidgetWrapper>
  );
};

const OrganizationWidgetWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};

  .illustration {
    grid-column: 6 span;
    padding: 44px 60px;
    background: #0071ff;
    /* height: 100vh;  */
    width: 100%;
    background-repeat: no-repeat;
    background-position: bottom right;
    .invyce_logo {
      padding-bottom: 41px;
      img {
        width: 117px;
      }
    }
    .slogan {
      font-style: normal;
      font-weight: 500;
      font-size: 34px;
      line-height: 51px;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      text-transform: capitalize;

      color: #ffffff;
    }
    .illustration_image {
      text-align: center;
      img {
        max-width: 74%;
        height: auto;
      }
    }
  }
  .form {
    padding: 70px 70px;
    grid-column: 6 span;
    height: 100vh;
    overflow-y: auto;
  }

  .ant-input-group-addon {
    background: none;
    border: 1px solid #f4f4f4;
  }
`;
