import { Button } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { Heading } from "../../../components/Heading";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { PermissionList } from "../PermissionsList";

export const PermissionsSettingsContainer: FC = () => {
  const { setPermissionConfigModal } = useGlobalContext();

  return (
    <WrapperPermissionContainer>
      <div className="flex alignCenter justifySpaceBetween pb-20">
        <Heading type="table">Permission Settings</Heading>
        <Button
          onClick={() => setPermissionConfigModal(true)}
          type="primary"
          size="middle"
        >
          Add Permission
        </Button>
      </div>

      <PermissionList />
    </WrapperPermissionContainer>
  );
};

const WrapperPermissionContainer = styled.div``;
