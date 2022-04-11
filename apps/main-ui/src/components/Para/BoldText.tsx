import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const BoldText = styled.p`
  margin: 0;
  padding: 0;
  font-weight: 600;
  color: ${(props: IThemeProps) => props.theme.colors.textTd};
`;

export const BOLDTEXT = styled.span`
  margin: 0;
  padding: 0;
  font-weight: 600;
`;
