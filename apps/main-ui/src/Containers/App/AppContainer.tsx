import React from "react";
import { renderRoutes } from "react-router-config";
import { BrowserRouter } from "react-router-dom";
import { routes } from "../../routes/index";
import { ReactQueryConfigProvider } from "react-query";
import { Color } from "../../modal";
import styled, { ThemeProvider } from "styled-components";
import { ITheme, Themes } from "../../hooks/useTheme/themeColors";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";

const AppContainer = () => {
  // react query config
  const rqConfig = {
    queries: {
      staleTime: 1000 * 0.7 * 60, // that's one min.
      cacheTime: 1000 * 10 * 60, // those're 10 mins.
    },
  };

  // const { theme } = useGlobalContext();
  // let layoutTheme: ITheme = {
  //   colors: Themes[theme],
  // };

  return (
    <BrowserRouter>
      <ReactQueryConfigProvider config={rqConfig}>
        {/* <ThemeProvider theme={{ ...layoutTheme }}> */}
        <ThemeWrapper>{renderRoutes(routes())}</ThemeWrapper>
        {/* </ThemeProvider> */}
      </ReactQueryConfigProvider>
    </BrowserRouter>
  );
};

export default AppContainer;

const ThemeWrapper = styled.div`
  .clr-primary {
    color: ${Color.$PRIMARY};
  }

  .pointer {
    cursor: pointer;
  }
`;
