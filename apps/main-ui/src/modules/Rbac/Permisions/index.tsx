import { Col, Row } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { Heading } from "../../../components/Heading";
import { PermissionsLayout } from "./PermissionsLayout";

export const PermissionsContainer: FC = () => {
  return (
    <WrapperPermissionContainer>
      <Row gutter={24}>
        <Col span={18} >
          <div className="flex alignCenter justifySpaceBetween pb-20">
            <Heading type="table">Permissions</Heading>
            {/* <Button
          onClick={() => setPermissionConfigModal(true)}
          type="primary"
          size="middle"
        >
          Add Permission
        </Button> */}
          </div>

          <PermissionsLayout />
        </Col>
      </Row>
    </WrapperPermissionContainer>
  );
};

const WrapperPermissionContainer = styled.div``;
