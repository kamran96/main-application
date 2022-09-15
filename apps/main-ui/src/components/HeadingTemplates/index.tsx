import React, { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '../Heading';
import { Seprator } from '../Seprator';

interface IProps {
  title: string;
  paragraph: string;
}
export const HeadingTemplate1: FC<IProps> = ({ title, paragraph }) => {
  return (
    <StyledWrapper className="form_title">
      <Heading className="mb-2" type="table">
        {title}
      </Heading>
      <p className="form_description">{paragraph}</p>
      <Seprator />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form_title {
    padding-bottom: 70px;
  }

  .form_description {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    /* or 125% */

    display: flex;
    align-items: center;

    color: #2d4155;
  }
`;
