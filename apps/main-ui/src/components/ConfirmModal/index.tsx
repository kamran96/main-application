import infoCircleOutlined from '@iconify-icons/ant-design/info-circle-outline';
import warningOutlined from '@iconify-icons/ant-design/warning-outlined';
import deleteIcon from '@iconify/icons-carbon/delete';
import mentionIcon from '@iconify/icons-fe/mention';
import Icon from '@iconify/react';
import { Button, Modal } from 'antd';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

interface IProps {
  visible: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  type?: 'delete' | 'warning' | 'info' | 'mention';
  text?: string;
  children?: ReactNode;
  confirmText?: string;
  showButtons?: boolean;
}

const defaultProps: IProps = {
  visible: false,
  type: 'delete',
  text: 'Are you sure want to delete ?',
  confirmText: 'Confirm',
  showButtons: true,
};

export const ConfirmModal: FC<IProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading,
  type,
  text,
  children,
  confirmText,
  showButtons = true,
} = defaultProps) => {
  const iconClass =
    type === 'delete'
      ? 'delete-icon'
      : type === 'info'
      ? 'info-icon'
      : type === 'warning'
      ? 'warning-icon'
      : type === 'mention'
      ? 'mention-icon'
      : 'delete-icon';
  const icon =
    type === 'delete'
      ? deleteIcon
      : type === 'info'
      ? infoCircleOutlined
      : type === 'warning'
      ? warningOutlined
      : type === 'mention'
      ? mentionIcon
      : deleteIcon;

  const isDangerbutton = type === 'delete' ? { danger: true } : null;
  return (
    <WrapperConfirmModal
      width={400}
      visible={visible}
      onCancel={onCancel}
      okText="Confirm"
      footer={false}
    >
      <div className="custom_modal">
        <div className="icon_area textCenter">
          <i className={`icon_bg ${iconClass}`}>
            <Icon icon={icon} />
          </i>
        </div>
        <div className="text_area textCenter">
          {children ? children : <h3> {text}</h3>}
        </div>
        {showButtons && (
          <div className="actions">
            <Button
              onClick={onCancel}
              className="mr-10"
              type="default"
              size="middle"
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={onConfirm}
              {...isDangerbutton}
              type="primary"
              size="middle"
            >
              {confirmText ? confirmText : 'Confirm'}
            </Button>
          </div>
        )}
      </div>
    </WrapperConfirmModal>
  );
};

const WrapperConfirmModal = styled(Modal)`
  .custom_modal {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
  }

  .icon_area {
    width: 70px;
    height: 70px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    i {
      font-size: 29px;
      display: flex;
      align-items: center;
    }

    .delete-icon {
      color: #ff0000;
    }
    .mention-icon {
      color: ${(props: IThemeProps) => props?.theme?.colors?.$PRIMARY};
    }
    .info-icon {
      color: ${(props: IThemeProps) => props?.theme?.colors?.$PRIMARY};
    }
    .warning-icon {
      color: #ffb100;
    }
  }
  .text_area {
    padding: 11px 9px;
    h3 {
      font-size: 17px;
      font-weight: 400;
      color: #424242;
    }
  }
`;
