import styled from "styled-components";
import { Menu } from "antd";
import convertToRem from "../../../utils/convertToRem";
import { Color } from "../../../modal";

export const ItemsListWrapper = styled.div`
  .custom_topbar {
    display: flex;
    align-items: center;
    padding: 12px 0;
    justify-content: space-between;

    .edit {
      display: flex;
      a {
        margin: 0 ${convertToRem(10)};
      }
    }
    .sort_select {
      margin: 0 20px;
    }

    .icon_filter > svg {
      cursor: pointer;
    }
  }

 
`;

export const ActionsMenuWrapper = styled(Menu)`
  padding: 0 0;
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: ${convertToRem(10)} ${convertToRem(26)} ${convertToRem(10)}
      ${convertToRem(15)};
    font-weight: normal;
    font-size: ${convertToRem(12)};
    line-height: ${convertToRem(16)};
    letter-spacing: 0.05em;
    text-transform: capitalize;
    color: ${Color.$TEXT};
  }

  .ant-dropdown-menu-item-divider,
  .ant-dropdown-menu-submenu-title-divider {
    margin: 0;
  }
`;
