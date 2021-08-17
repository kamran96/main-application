import { Button, Col, Input, Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import RegIllustration from "../../assets/registration.png";
import { FormCard } from "../../components/FormCard";
import { FormLabel } from "../../components/FormLabel";
import { Heading } from "../../components/Heading";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { NOTIFICATIONTYPE } from "../../modal";
import { RegisterForm } from "./RegisterForm";
import { RegisterWrapper } from "./styles";
import InvyceLog from "../../assets/invyceLogo.png";

export const Register: FC = () => {
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const { notificationCallback } = useGlobalContext();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsVerified(true);
    }
  }, []);

  const checkPassword = () => {
    if (password === process.env.REACT_APP_REGISTER_KEY) {
      notificationCallback(NOTIFICATIONTYPE.SUCCESS, "Super Admin Verified");
      setIsVerified(true);
      setPassword("");
    } else {
      notificationCallback(NOTIFICATIONTYPE.ERROR, "Un Authorized");
      setPassword("");
    }
  };

  return (
    <RegisterWrapper>
      <Row className="w-100">
        {!isVerified ? (
          <Col span={10} offset={7}>
            <FormCard>
              <div className="pb-10">
                <Heading type="form">Super Admin Login</Heading>
              </div>
              <FormLabel>Password</FormLabel>
              <div className="flex aligCenter justifyCenter">
                <Input.Password
                  className="mr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={checkPassword} type="primary" size="middle">
                  Check
                </Button>
              </div>
            </FormCard>
          </Col>
        ) : (
          <div className="register_grid">
            <div className="illustration">
              <div className="invyce_logo"><img src={InvyceLog} alt={'invyce logo'}/></div>
              <h2 className="slogan">
                A few click away
                <br />
                from creating your
                <br />
                own account
              </h2>
              <div className="illustration_image">
              <img  src={RegIllustration} alt="illustration" />
              </div>
            </div>
            <div className="form">
              <RegisterForm />
            </div>
          </div>
          // <Col span={10} offset={7} className="customCol">
          //     <Heading type="form">Create an Account</Heading>
          //     <Para type="slogan">Enjoy your Journey</Para>
          //     <Seprator />
          //     <RegisterForm />
          // </Col>
        )}
      </Row>
    </RegisterWrapper>
  );
};
