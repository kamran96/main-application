import styled from 'styled-components';

/* eslint-disable-next-line */
export interface SharedInvyceThemeProps {}

const StyledSharedInvyceTheme = styled.div`
  color: pink;
`;

export function SharedInvyceTheme(props: SharedInvyceThemeProps) {
  return (
    <StyledSharedInvyceTheme>
      <h1>Welcome to SharedInvyceTheme!</h1>
    </StyledSharedInvyceTheme>
  );
}

export default SharedInvyceTheme;
