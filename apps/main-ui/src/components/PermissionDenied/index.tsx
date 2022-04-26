import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { TableCard } from '../TableCard';
import { H2, P } from '../Typography';

export const PermissionDenied = () => {
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;
  return (
    <WrapperPermissionDenied>
      <TableCard className="card flex alignCenter justifyCenter">
        <div className="textCenter">
          <H2 className="textCenter">We are Sorry...</H2>
          <P className="para textCenter pv-20">
            The Page you're trying to access has restricted access.
            <br /> Please refer to your system administrator
          </P>
          <Button
            type="primary"
            size="middle"
            onClick={() => history.push(`/app/dashboard`)}
          >
            Go Back
          </Button>
        </div>
      </TableCard>
    </WrapperPermissionDenied>
  );
};

const WrapperPermissionDenied = styled.div`
  .card {
    height: calc(100vh - 100px);
  }
  .para {
    color: #5c5c5c;
    letter-spacing: 0.9px;
    font-size: 16px;
  }
`;
