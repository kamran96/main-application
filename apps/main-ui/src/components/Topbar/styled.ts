import { IThemeProps } from './../../hooks/useTheme/themeColors';
import styled from 'styled-components';
import convertToRem from '../../utils/convertToRem';

export const WrapperTopbar = styled.div`
  background: ${(props: IThemeProps) => props.theme.colors.topbar};
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
  height: ${convertToRem(40)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${convertToRem(20)};
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  .logo {
    display: flex;
    align-items: center;
    height: ${convertToRem(40)};

    span svg {
      width: 108px;
    }
  }
`;

export const WrapperUnverified = styled.div`
  height: 34px;
  left: 0px;
  right: 0px;
  top: 0px;
  width: 100%;

  background: #c23934;

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    /* identical to box height */

    text-transform: capitalize;

    color: #ffffff;

    .ant-btn-link {
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
      /* identical to box height */

      text-transform: capitalize;

      color: #ffffff;
    }
  }
`;
