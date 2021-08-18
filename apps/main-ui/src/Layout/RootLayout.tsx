import React, { useEffect, useState } from "react";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import { useGlobalContext } from "../hooks/globalContext/globalContext";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

export const RootLayout = (props: RouteConfigComponentProps) => {
  const { handleRouteHistory, isCheckingLoginUser } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   handleRouteHistory(props);
  // });

  const getLoading = () => {
    if (loading) {
      return true;
    } else {
      return isCheckingLoginUser;
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  if (getLoading()) {
    return (
      <WrapperLoader>
        <div className="phunar_loader">
          <p>Invyce is checking user details please wait</p>
          <Spin indicator={antIcon} />
        </div>
      </WrapperLoader>
    );
  }

  return <>{renderRoutes(props.route.routes)}</>;
};

const WrapperLoader = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .phunar_loader {
    display: flex;
    flex-direction: column;
    height: 100px;
    justify-content: space-between;

    p {
      font-size: 16px;
      color: #757575;
      font-weight: 400;
    }
  }
`;
