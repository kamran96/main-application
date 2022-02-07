import React, { FC } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '@invyce/shared/invyce-theme';
import { Color } from '@invyce/shared/types';
import { convertToRem } from '@invyce/pixels-to-rem';

interface IProps {
  type?: 'form' | 'table' | 'container' | 'normal' | 'form-inner';
  children?: string | React.ReactElement<any> | any;
  onClick?: () => void;
  onMouseOver?: () => void;
  fontWeight?: '400' | '600' | '500' | '700';
  color?: string;
  className?: string;
}

const defaultProps: IProps = {
  type: 'form',
};

export const Heading: FC<IProps> = ({
  type,
  children,
  onClick,
  onMouseOver,
  fontWeight,
  color,
  className,
} = defaultProps) => {
  return (
    <HeadingWrapper
      fontWeight={fontWeight}
      color={color}
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={className}
    >
      <h2
        className={`heading ${
          type === 'form'
            ? 'headingForm'
            : type === 'container'
            ? 'headingContainer'
            : type === 'table'
            ? 'headingTable'
            : type === 'normal'
            ? 'normal_heading'
            : type === 'form-inner'
            ? 'form-inner'
            : ''
        }`}
      >
        {children}
      </h2>
    </HeadingWrapper>
  );
};

const HeadingWrapper: any = styled.div`
  .heading {
    margin: 0;
    color: ${(props: IThemeProps) =>
      props.color
        ? props.color
        : props.theme
        ? props?.theme?.colors?.$LIGHT_BLACK
        : Color.$LIGHT_BLACK};
  }
  .headingForm {
    font-style: normal;
    font-weight: ${(props: any) =>
      props.fontWeight ? props.fontWeight : '600'};
    font-size: ${convertToRem(22)};
    line-height: ${convertToRem(30)};
  }
  .headingContainer {
    font-style: normal;
    font-weight: ${(props: any) =>
      props.fontWeight ? props.fontWeight : '500'};
    font-size: ${convertToRem(22)};
  }

  .headingTable {
    font-style: normal;
    font-weight: ${(props: any) =>
      props.fontWeight ? props.fontWeight : 'bold'};
    font-size: ${convertToRem(28)};
  }
  .normal_heading {
    font-style: normal;
    font-weight: ${(props: any) =>
      props.fontWeight ? props.fontWeight : 'bold'};
    font-size: ${convertToRem(14)};
  }

  .form-inner {
    font-style: normal;
    font-weight: ${(props: any) => (props.fontWeight ? props.fontWeight : 500)};
    font-size: ${convertToRem(16)};
    line-height: ${convertToRem(19)};
    letter-spacing: 0.04em;
  }
`;
