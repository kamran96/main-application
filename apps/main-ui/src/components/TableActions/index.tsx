import Icon from "@iconify/react";
import React, { FC, ReactElement} from "react";
import styled from "styled-components";
import { Color } from "../../modal";
import convertToRem from "../../utils/convertToRem";
import threeDotsVertical from "@iconify-icons/bi/three-dots-vertical";
import { Dropdown, Menu } from "antd";

interface IProps {
  children?: ReactElement<any>;
  onClick?: () => void;
}

export const TableActions: FC<IProps> = ({ children, onClick }) => {
  return (
    <WrapperTableActions onClick={onClick}>{children}</WrapperTableActions>
  );
};

export const MoreActions: FC = ({ children }) => {
  const menu = (
    <Menu className="menu_wrapper">
      {children ? (
        children
      ) : (
        <>
          {" "}
          <Menu.Item className="list_item">Archieve</Menu.Item>
          <Menu.Item className="list_item">Send to Email</Menu.Item>
          <Menu.Item className="list_item">Download</Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Icon
        style={{
          fontSize: convertToRem(18),
          color: Color.$GRAY_LIGHT,
          cursor: "pointer",
        }}
        icon={threeDotsVertical}
      />
    </Dropdown>
  );
};

const WrapperTableActions = styled.div`
  width: ${convertToRem(24)};
  height: ${convertToRem(24)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ededed;
  border-radius: ${convertToRem(2)};
  margin: 0 ${convertToRem(4)};
`;
