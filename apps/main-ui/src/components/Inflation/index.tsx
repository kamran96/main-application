import React, { FC } from 'react';
import styled from 'styled-components';
import redTrianglePointedDown from '@iconify-icons/emojione-monotone/red-triangle-pointed-down';
import Icon from '@iconify/react';

interface IProps {
  status: 'up' | 'down';
  value: string;
}

export const Inflation: FC<IProps> = ({ status, value }) => {
  return (
    <WrapperInflation status={status} className="flex alignCenter">
      <p className="m-reset">{value}</p>
      <i
        className={`_icon flex alignCenter ${
          status === 'down' ? '_down' : '_up'
        }`}
      >
        <Icon icon={redTrianglePointedDown} />
      </i>
    </WrapperInflation>
  );
};

interface IInflationWraperProps {
  status: 'up' | 'down';
}

const WrapperInflation = styled.div<IInflationWraperProps>`
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    text-transform: capitalize;
    color: ${(props: any) => (props.status === 'down' ? `#F5222D` : '#48AF08')};
  }
  ._icon {
    font-size: 9px;
    color: ${(props: any) => (props.status === 'down' ? '#F5222D' : '#48AF08')};
    transform: ${(props: any) =>
      props.status === 'up' ? `rotate(-180deg)` : `rotate(0)`};
  }
`;
