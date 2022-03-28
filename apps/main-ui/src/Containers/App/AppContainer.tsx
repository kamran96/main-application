import { renderRoutes } from 'react-router-config';
import styled from 'styled-components';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { Color } from '../../modal';
import { routes } from '../../routes/index';

const AppContainer = () => {
  const { theme } = useGlobalContext();

  return <ThemeWrapper theme={theme}>{renderRoutes(routes())}</ThemeWrapper>;
};

export default AppContainer;

interface IThemeWrapperProps {
  theme: 'dark' | 'light';
}

const ThemeWrapper = styled.div<IThemeWrapperProps>`
  .clr-primary {
    color: ${Color.$PRIMARY};
  }

  .pointer {
    cursor: pointer;
  }
`;
