import React from 'react';
import styled from 'styled-components';
import { TaxList } from './TaxList';

export const TaxSettings = () => {
  return (
    <Wrapper>
      <TaxList />
    </Wrapper>
  );
};

const Wrapper = styled.div``;
