import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { CommonTable } from '@components';

export const GeneralPreferencesTable: FC = () => {
  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Type',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
      },
    ],
    []
  );

  return (
    <WrapperGeneralPreferences>
      <CommonTable
        data={[]}
        columns={columns}
        pagination={false}
        hasfooter={true}
      />
    </WrapperGeneralPreferences>
  );
};

const WrapperGeneralPreferences = styled.div``;
