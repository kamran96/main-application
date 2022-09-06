import { Button } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '@components';
import { RbacList } from './RbacList';
import addLine from '@iconify/icons-ri/add-line';
import Icon from '@iconify/react';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';

export const RbacContainer: FC = () => {
  const { setRbacConfigModal } = useGlobalContext();
  return (
    <WrapperRbacContainer>
      <div className="flex alignCenter justifySpaceBetween pv-20">
        <Heading type={'table'}>Roles</Heading>
        <Button
          onClick={() => setRbacConfigModal(true)}
          className="flex alignCenter"
          type="primary"
          size="middle"
        >
          <span className="icon-left flex alignCenter mr-10">
            <Icon icon={addLine} />
          </span>{' '}
          New Role
        </Button>
      </div>
      <RbacList />
    </WrapperRbacContainer>
  );
};

const WrapperRbacContainer = styled.div``;
