import styled from 'styled-components';
import { Link as NavLink } from 'react-router-dom';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const Link = styled(NavLink)`
  color: ${(props: IThemeProps) => props?.theme?.colors?.linkColor};
`;
