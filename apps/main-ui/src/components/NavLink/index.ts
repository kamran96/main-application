import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const NavLink = styled(Link)`
  color: ${(props: IThemeProps) => props?.theme?.colors.linkColor};
`;
