import React, { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

interface IProps {
  className?: string;
}

export const Loader: FC<IProps> = ({ className }) => {
  return (
    <div className={`flex alignCenter justifyCenter ${className}`}>
      <Spin indicator={antIcon} />
    </div>
  );
};
