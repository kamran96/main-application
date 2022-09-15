import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';
import convertToRem from '../../utils/convertToRem';

export const Seprator = styled.hr((props: IThemeProps) => {
  return {
    border: 'none',
    height: `${convertToRem(1)}`,
    background: props?.theme?.colors?.seprator || `#F4F4F4`,
    width:  '100%',
    ...props,
  };
});
