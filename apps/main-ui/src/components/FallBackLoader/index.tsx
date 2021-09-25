import React, { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import styled from "styled-components";
import { IThemeProps } from "../../hooks/useTheme/themeColors";

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

export const FallBackLoader: FC = () => {
  return (
    <FallbackLoaderWrapper>
      <Spin indicator={antIcon} />
    </FallbackLoaderWrapper>
  );
};
const FallbackLoaderWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 210px);
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  background: ${(props: IThemeProps) => props?.theme?.colors?.fallbackLoader};
  border-radius: 5px;
`;

export const CommonLoader = () => {
  return <Spin indicator={antIcon} />;
};
