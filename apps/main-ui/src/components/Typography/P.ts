import { IThemeProps } from "./../../hooks/useTheme/themeColors";
import styled from "styled-components";

export const P = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 127.3%;
  letter-spacing: 0.02em;
  color: ${(props: IThemeProps) =>
    props?.theme?.theme === "dark"
      ? props?.theme?.colors?.textTd
      : props?.theme?.colors?.$WHITE};
  margin: 0;
`;
