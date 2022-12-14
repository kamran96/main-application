import { FC } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line';
import arrowRightLine from '@iconify/icons-ri/arrow-right-line';
import { convertToRem } from '@invyce/pixels-to-rem';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
type ButtonProps = JSX.IntrinsicElements['button'];

interface IButton extends ButtonProps {
  onClick: () => void;
  iconType: 'left' | 'right';
}
export const ArrowButton: FC<IButton> = ({ onClick, iconType, ...rest }) => {
  return (
    <AButton className={rest.className} onClick={onClick}>
      <Icon
        className="icon"
        width={20}
        height={20}
        icon={iconType === 'left' ? arrowLeftLine : arrowRightLine}
      />
    </AButton>
  );
};

const AButton = styled.button`
  border-radius: 2px;
  height: ${convertToRem(33)};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  outline: none;
  border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.seprator};

  .icon {
    font-size: 26px;
  }
`;
