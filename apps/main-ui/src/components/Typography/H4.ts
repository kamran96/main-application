import { IThemeProps } from "./../../hooks/useTheme/themeColors";
import styled from "styled-components";

export const H4 = styled.h4`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 0;
  color: ${(props: IThemeProps) => props?.theme?.colors?.textTd || "#303030"};
`;

export const H3 = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 0;
  color: ${(props: IThemeProps) => props?.theme?.colors?.textTd || "#303030"};
`;

export const H2 = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 0;
  color: ${(props: IThemeProps) => props?.theme?.colors?.textTd || "#303030"};
`;

export const Capitalize = styled.span`
  position: relative;
  text-transform: capitalize;
`
export const Uppercase = styled.span`
  position: relative;
  text-transform: uppercase;
`
export const Lowercase = styled.span`
  position: relative;
  text-transform: lowercase;
`