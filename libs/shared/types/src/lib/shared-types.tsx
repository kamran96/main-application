import styled from 'styled-components';

/* eslint-disable-next-line */
export interface SharedTypesProps {}

const StyledSharedTypes = styled.div`
  color: pink;
`;

export function SharedTypes(props: SharedTypesProps) {
  return (
    <StyledSharedTypes>
      <h1>Welcome to SharedTypes!</h1>
    </StyledSharedTypes>
  );
}

export default SharedTypes;
