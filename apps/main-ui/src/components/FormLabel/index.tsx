import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import convertToRem from '../../utils/convertToRem';

interface IProps {
  children?: any | ReactElement<any>;
  isRequired?: boolean;
  className?: string;
}

const defaultProps: IProps = {
  isRequired: false,
};
export const FormLabel: FC<IProps> = ({
  children,
  isRequired,
  className,
} = defaultProps) => {
  return (
    <LabelWrapper className={className}>
      <span>
        {children} {isRequired && <i>*</i>}
      </span>
    </LabelWrapper>
  );
};

const LabelWrapper = styled.div`
  span {
    font-style: normal;
    font-weight: 500;
    font-size: ${convertToRem(13)};
    line-height: ${convertToRem(17)};
    color: ${(props: IThemeProps) => props?.theme?.colors?.formLabel};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    i {
      color: red;
      font-size: ${convertToRem(16)};
    }
  }
`;
