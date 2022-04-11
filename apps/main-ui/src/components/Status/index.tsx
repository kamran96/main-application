import React, { SFC } from 'react';
import styled from 'styled-components';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'react-feather';

export enum StatusType {
  DANGER = 'danger',
  SUCCESS = 'success',
  warning = 'warning',
  DEFAULT = 'default',
  INFO = 'info',
}

interface IProps {
  type?: 'danger' | 'success' | 'warning' | 'default' | 'info';
  text?: string;
}

const defaultProps: IProps = {
  type: StatusType.DEFAULT,
};
export const Status: SFC<IProps> = ({ type, text } = defaultProps) => {
  return (
    <StatusWrapper type={type}>
      {type !== 'default' && (
        <i>
          {type === 'warning' ? (
            <AlertCircle size={20} />
          ) : type === 'success' ? (
            <CheckCircle size={20} />
          ) : type === 'danger' ? (
            <AlertTriangle size={20} />
          ) : type === 'info' ? (
            <Info />
          ) : null}
        </i>
      )}
      {text}
    </StatusWrapper>
  );
};

export const StatusWrapper: any = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: 4px 0;
  color: ${(props: any) =>
    props.type === StatusType.DANGER
      ? 'red'
      : props.type === StatusType.SUCCESS
      ? 'green'
      : props.type === StatusType.warning
      ? 'orange'
      : 'black'};

  i {
    margin-right: 5px;
    display: flex;
    align-items: center;
    svg {
      fill: ${(props: any) =>
        props.type === StatusType.INFO ? '#2196F3' : 'auto'};
      color: ${(props: any) =>
        props.type === StatusType.INFO ? 'white' : 'auto'};
    }
  }
`;
