import Icon from '@iconify/react';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { FC, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

import { Color } from '../../modal';

interface IProps {
  size: SizeType;
  title: string;
  icon?: any;
  onClick?: () => void;
  ref?: Ref<any>;
  disabled?: boolean;
  className?: string;
  type?: ButtonType;
  ghost?: boolean;
  loading?: boolean;
  customizeIcon?: ReactNode;
}

export const ButtonTag: FC<IProps> = ({
  disabled,
  className,
  size,
  ref,
  onClick,
  icon,
  title,
  type,
  ghost,
  loading,
  customizeIcon,
}) => {
  return (
    <WrapperButtonTag>
      <Button
        loading={loading}
        type={type}
        ghost={ghost}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        className={`flex alignCenter ${className} ${
          !disabled ? '_customized_button' : ''
        }`}
        size={size}
      >
        {customizeIcon && <div>{customizeIcon}</div>}
        {icon && (
          <i className="flex alignCenter _icon_button">
            <Icon icon={icon} />
          </i>
        )}
        {title}
      </Button>
    </WrapperButtonTag>
  );
};

const WrapperButtonTag = styled.div`
  button {
    margin-right: 7px;
    border-radius: 4px;
    border: none;
    ._icon_button {
      position: relative;
      top: -2px;
      margin-right: 5px;
    }
  }
  ._customized_button {
    background: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagBg};
    color: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagColor};
    span {
      color: ${(props: IThemeProps) => props?.theme?.colors?.buttonTagColor};
    }

    &:hover {
      background: ${Color.$Secondary} !important;
      color: ${Color.$WHITE};
      span {
        color: ${Color.$WHITE};
      }
    }
  }
`;
