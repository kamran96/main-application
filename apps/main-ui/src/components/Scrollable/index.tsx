import React, { SFC } from 'react';
import styled from 'styled-components';

interface IProps {
  overflowX?: boolean;
  overFlowY?: boolean;
  children?: React.ReactElement<any>;
}

const defaultProps: IProps = {
  overFlowY: true,
};

export const Scrollable: SFC<IProps> = ({
  children,
  overFlowY,
  overflowX,
} = defaultProps) => {
  return (
    <WrapperScrollable
      attributes={{ overflowX: overflowX, overFlowY: overFlowY }}
    >
      {children}
    </WrapperScrollable>
  );
};

const WrapperScrollable: any = styled.div`
  overflow-x: auto;
  overflow-y: scroll;
  height: 100vh;
`;
