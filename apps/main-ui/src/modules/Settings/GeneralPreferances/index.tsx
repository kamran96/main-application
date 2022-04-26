import { Button } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Heading } from '../../../components/Heading';
import { Seprator } from '../../../components/Seprator';
import { TableCard } from '../../../components/TableCard';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import convertToRem from '../../../utils/convertToRem';
import { GeneralPreferencesTable } from './GeneralPreferencesTable';

// import { GeneralPreferencesForm } from "./Form";

interface IProps {}

export const GeneralPreferances: FC<IProps> = () => {
  /* useForm hook antd */
  const { setPreferancesModal } = useGlobalContext();

  return (
    <WrapperGeneralPreferances>
      <TableCard>
        <Heading type="table">Preferences</Heading>
        <Seprator />
        <div className="action_preference">
          <Button
            onClick={() => setPreferancesModal(true)}
            type="primary"
            size="middle"
          >
            Add Preferences
          </Button>
        </div>

        <GeneralPreferencesTable />
      </TableCard>
    </WrapperGeneralPreferances>
  );
};

const WrapperGeneralPreferances: any = styled.div`
  .action_preference {
    text-align: right;
    padding: ${convertToRem(15)} 0;
  }
`;
