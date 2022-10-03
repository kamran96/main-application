import { renderRoutes } from 'react-router-config';
import styled from 'styled-components';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { routes } from '../../routes/index';
import { ConfigProvider } from 'antd';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

const AppContainer = () => {
  const { theme } = useGlobalContext();
  ConfigProvider.config({
    prefixCls: 'custom',
    theme: {
      primaryColor: '#69dc17',
    },
  });

  return (
    <ConfigProvider>
      <ThemeWrapper theme={theme}>{renderRoutes(routes())}</ThemeWrapper>
    </ConfigProvider>
  );
};

export default AppContainer;

interface IThemeWrapperProps {
  theme: 'dark' | 'light';
}

const ThemeWrapper = styled.div<IThemeWrapperProps>`
  .clr-primary {
    color: ${(props: IThemeProps) => props?.theme?.colors?.$PRIMARY};
  }

  .pointer {
    cursor: pointer;
  }
`;
