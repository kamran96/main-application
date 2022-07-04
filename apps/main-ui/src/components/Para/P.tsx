import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const P = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  color: ${(props: IThemeProps) => props.theme.colors.textTd};
  margin: 0;
`;
