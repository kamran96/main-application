import React, { SFC } from "react";
import styled from "styled-components";
import { Color } from "../../modal";
import convertToRem from "../../utils/convertToRem";

interface IProps {
  type?:
    | "slogan"
    | "table-data"
    | "normal"
    | "gray_text"
    | "heading-description";
  children?: string | React.ReactElement<any> | any;
  onClick?: () => void;
  onMouseOver?: () => void;
  margin?: "rest" | "auto";
}

const defaultProps: IProps = {
  type: "slogan",
  margin: "auto",
};

export const Para: SFC<IProps> = ({
  type,
  children,
  onClick,
  onMouseOver,
  margin,
} = defaultProps) => {
  return (
    <ParaWrapper
      onClick={onClick}
      onMouseOver={onMouseOver}
      type={type}
      margin={margin}
      className={`para ${
        type === "slogan"
          ? "para-slogan"
          : type === "table-data"
          ? "para-table"
          : type === "normal"
          ? "normal-text"
          : type === "heading-description"
          ? "heading-description"
          : "default"
      }`}
    >
      {children}
    </ParaWrapper>
  );
};

const ParaWrapper: any = styled.p`
  margin: ${(props: any) => (props.margin === "reset" ? "0px" : "unset")};
  font-style: normal;
  font-weight: normal;
  font-size: ${(props: any) =>
    props.type === "slogan"
      ? `${convertToRem(16)}`
      : props.type === "table-data"
      ? `${convertToRem(16)}`
      : props.type === "normal-text"
      ? `${convertToRem(14)}`
      : props.type === "gray_text"
      ? convertToRem(14)
      : props.type === "heading-description"
      ? convertToRem(13)
      : convertToRem(14)};
  line-height: ${(props: any) =>
    props.type === "slogan"
      ? "19px"
      : props.type === "table-data"
      ? "18px"
      : "auto"};
  color: ${(props: any) => (props.type = "gray_text" ? "#BDBDBD" : "#4a4a4a")};

  .default {
    color: ${Color.$BLACK};
  }
`;
