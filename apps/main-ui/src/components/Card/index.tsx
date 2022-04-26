import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import convertToRem from '../../utils/convertToRem';

export const Card = styled.div`
  padding: ${convertToRem(12)} ${convertToRem(16)};
  border-radius: 4px;
  width: 100%;
  background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
`;
