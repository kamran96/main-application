import React, { FC, useState } from "react";
import { Card } from "../../components/Card";
import { H2, H4, P } from "../../components/Typography";
import { Button, Col, Input, Row, Switch } from "antd";
import PaywallPackages from "./offers";
import checkIcon from "@iconify-icons/fe/check";
import chevronLeft from "@iconify-icons/feather/chevron-left";
import Icon from "@iconify/react";
import { Form } from "antd";
import { FormLabel } from "../../components/FormLabel";
import { WrapperPaywall, PaywallModal } from "./styles";
import Illustration from "../../assets/paywall.png";
import MaskedInput from "antd-mask-input";

export const Paywall: FC = () => {
  const [step, setStep] = useState(1);

  const onFinish = (value) => {
    let payload = {
      ...value,
      card_number: value.card_number.replace(/\s+/g, ""),
    };
  };

  return (
    <>
      {/* <GlobalStylesReplacer /> */}
      <PaywallModal visible={false} footer={false} width={1003}>
        <WrapperPaywall step={step} >
          <div className="main-wrapper">
            <div className="flex alignCenter package_screen">
              <Card className="free_card">
                <div>
                  <H2 className="bold mb-10">Free</H2>
                  <P className="package_description">
                    Try it as long as you like
                  </P>

                  <div className="package_offers">
                    <ul className="list_packages">
                      {PaywallPackages.free.package.map((item, index) => {
                        return (
                          <li className="flex alignCenter">
                            <Icon className="mr-10 icon" icon={checkIcon} />
                            {item.title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="package_using">
                  <H4> You are using free version</H4>
                </div>
              </Card>
              <Card className="premium_card">
                <div>
                  <div className="package_switch">
                    <div>
                      Monthly &nbsp;{" "}
                      <Switch
                        size="small"
                        defaultChecked
                        onChange={(checked) => console.log(checked)}
                      />{" "}
                      &nbsp; Yearly
                    </div>
                  </div>
                  <div className="premium_card_content">
                    <H2 className="premium_heading">Pro</H2>
                    <P className="package_description">Limtless possibilites</P>
                  </div>
                  <div className="package_offers">
                    <ul className="list_packages premium_offers">
                      {PaywallPackages.pro.package.map((item, index) => {
                        return (
                          <li className="flex alignCenter">
                            <Icon className="mr-10 icon" icon={checkIcon} />
                            {item.title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="package_button">
                  <Button
                    onClick={() => setStep(2)}
                    type="default"
                    size="large"
                  >
                    Choose plan ({PaywallPackages.pro.price})
                  </Button>
                </div>
              </Card>
            </div>
            <div className="payment_screen">
              <div className="payment-form">
                <div className="flex alignCenter payment-heading">
                  <span
                    className="flex go-back alignCenter mr-10"
                    onClick={() => setStep(1)}
                  >
                    <Icon icon={chevronLeft} />
                  </span>
                  <H2 className="bold">Payment Method</H2>
                </div>
                <P className="payment_description">
                  Try it as long as you like
                </P>
                <div className="form">
                  <Form onFinish={onFinish}>
                    <Row gutter={24}>
                      <Col span={24}>
                        <FormLabel className="mb-6">Full Name</FormLabel>
                        <Form.Item
                          rules={[{ required: true, message: "Name required" }]}
                          name="name"
                        >
                          <Input
                            size="middle"
                            placeholder="Alex Smith"
                            className="payment-input"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <FormLabel className="mb-6">
                          Credit card number
                        </FormLabel>
                        <Form.Item name="card_number">
                          <MaskedInput
                            className="payment-input"
                            mask="1111   1111   1111   1111"
                            placeholder={"1111   1111   1111   1111"}
                            size="middle"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <FormLabel className="mb-6">Exp Date</FormLabel>
                        <Form.Item
                          name="expire_date"
                          rules={[
                            {
                              required: true,
                              message: "Expiry date is required",
                            },
                          ]}
                        >
                          <MaskedInput
                            className="payment-input"
                            mask="11/11"
                            placeholder={"MM/YY"}
                            size="middle"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <FormLabel className="mb-6">CVV</FormLabel>
                        <Form.Item
                          name="cvv"
                          rules={[
                            { required: true, message: "CVV is required" },
                          ]}
                        >
                          <MaskedInput
                            className="payment-input"
                            mask="111"
                            type="password"
                            placeholder="***"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            className="payment_submit_button"
                            type="default"
                            size="middle"
                            htmlType="submit"
                          >
                            Confirm Payment
                          </Button>
                        </Form.Item>
                        <div>
                          <p className="note">
                            <b>Note: </b> We are not storing your payment
                            details
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
              <div className="illustration">
                <img
                  src={Illustration}
                  alt="an illustration for paywall reference"
                />
              </div>
            </div>
          </div>
        </WrapperPaywall>
      </PaywallModal>
    </>
  );
};

export default Paywall;
