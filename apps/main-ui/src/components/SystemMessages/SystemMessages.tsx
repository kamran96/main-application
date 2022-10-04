import React, { SFC } from 'react';
import styled from 'styled-components';
import { Card } from '../Card';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';

import convertToRem from '../../utils/convertToRem';
import { H4, P } from '../Typography';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const SystemMessages: SFC = () => {
  const { userDetails } = useGlobalContext();
  return (
    <WrapperWellcome>
      <Card className="card">
        <div className="inner">
          <H4>Welcome! {userDetails.name}</H4>
          <P className="m-reset">
            We are glad that you’ve chosen invyce as your invoice software.
            Invyce is a next generation invoicing software.
          </P>
        </div>
      </Card>
    </WrapperWellcome>
  );
};

const WrapperWellcome = styled.div`
  margin: ${convertToRem(5)} 0;
  .card {
    background: #143c69;
  }

  .inner {
    padding: ${convertToRem(8)} ${convertToRem(38)};

    h4 {
      color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
    }
    p {
      color: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
      padding: ${convertToRem(8)} 0;
    }
  }
`;
