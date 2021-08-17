import { IThemeProps } from "./../../hooks/useTheme/themeColors";
import { Modal } from "antd";
import OriginModal from "antd/lib/modal/Modal";
import {
  ModalStaticFunctions,
  modalGlobalConfig,
} from "antd/lib/modal/confirm";
import styled from "styled-components";

declare type ModalType = typeof OriginModal &
  ModalStaticFunctions & {
    destroyAll: () => void;
    config: typeof modalGlobalConfig;
  };

export const CommonModal: ModalType = styled(Modal)`
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarBg}!important;
  }

  .ant-modal-title {
    color: ${(props: IThemeProps) => props?.theme?.colors?.textTd} !important;
  }

  .ant-modal-close-x span svg {
    color: white !important;
  }

  .ant-modal-close {
    position: absolute;
    top: -30px;
    right: -24px;
    z-index: 10;
    padding: 0;
    color: rgb(255 255 255);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: ${(props: IThemeProps) => props?.theme?.colors?.topbar};
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.3s;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
  }
`;

export default CommonModal;
