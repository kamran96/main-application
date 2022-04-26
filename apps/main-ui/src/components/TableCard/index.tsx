import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import { DivProps } from '../../modal';
import convertToRem from '../../utils/convertToRem';
import { CommonLoader } from '../FallBackLoader';

interface IProps {
  children?: ReactElement<any> | ReactElement[];
  className?: string;
  loading?: boolean;
  minHeight?: number | string;
  refernace?: any;
}

export const TableCard: FC<IProps> = ({
  children,
  className,
  loading = false,
  minHeight,
  refernace,
}) => {
  let height =
    typeof minHeight === 'number'
      ? JSON.stringify(minHeight) + 'px'
      : minHeight;

  return (
    <Wrapper className={className} height={height}>
      <div ref={refernace}>{children}</div>
      <div className={`loader ${loading ? 'show' : 'hide'}`}>
        <CommonLoader />
      </div>
    </Wrapper>
  );
};

interface ITableCardWrapper extends DivProps {
  height: string | number;
}

const Wrapper = styled.div<ITableCardWrapper>`
  background: ${(props: IThemeProps) => props.theme.colors.cardBg};
  box-shadow: 0 0 ${convertToRem(3)} rgba(0, 0, 0, 0.25);
  border-radius: ${convertToRem(4)};
  padding: ${convertToRem(20)} ${convertToRem(20)} ${convertToRem(30)}
    ${convertToRem(20)};
  min-height: ${(props: any) => (props.height ? props.height : 'unset')};
  position: relative;
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    background: ${(props: IThemeProps) => props?.theme?.colors?.fallbackLoader};
  }
  .show {
    z-index: 10;
    transition: 0.4s all ease-in-out;
  }
  .hide {
    z-index: -10;
    transition: 0.4s all ease-in-out;
  }
`;
