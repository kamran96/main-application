import { renderRoutes } from 'react-router-config';
import { routes } from '../../routes/index';
import { ReactQueryConfigProvider } from 'react-query';
import { Color } from '../../modal';
import styled, { ThemeProvider } from 'styled-components';
import { ITheme, Themes } from '../../hooks/useTheme/themeColors';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';

const AppContainer = () => {
  // react query config
  const rqConfig = {
    queries: {
      staleTime: 1000 * 0.7 * 60, // that's one min.
      cacheTime: 1000 * 10 * 60, // those're 10 mins.
    },
  };

  const { theme } = useGlobalContext();
  // let layoutTheme: ITheme = {
  //   colors: Themes[theme],
  // };

  console.log(theme, "theme is here")

  return (
    <ReactQueryConfigProvider config={rqConfig}>
      {/* <ThemeProvider theme={{ ...layoutTheme }}> */}
      <ThemeWrapper theme={theme}>{renderRoutes(routes())}</ThemeWrapper>
      {/* </ThemeProvider> */}
    </ReactQueryConfigProvider>
  );
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
