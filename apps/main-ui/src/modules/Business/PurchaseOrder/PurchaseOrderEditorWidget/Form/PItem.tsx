import React, { FC } from "react";
import styled from "styled-components";
import { IThemeProps } from "../../../../../hooks/useTheme/themeColors";
import { Color } from "../../../../../modal";
import convertToRem from "../../../../../utils/convertToRem";

interface IProps {
  title?: string;
  stock?: string;
  description?: string;
  onClick?: (e) => void;
}

export const PItem: FC<IProps> = ({ title, stock, onClick, description }) => {
  return (
    <WrapperPItem className="pointer" onClick={onClick}>
      <div className="flex alignCenter justifySpaceBetween">
        <div className="name_desc">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="flex alignCenter justify flexColumn stocks">
          <h3 className="bold margin-reset">{stock}</h3>
          <p>Units Left</p>
        </div>
      </div>
    </WrapperPItem>
  );
};

const WrapperPItem = styled.div`
  border-bottom: ${convertToRem(1)} solid
    ${(props: IThemeProps) => props?.theme?.colors?.seprator};
  padding: ${convertToRem(22)} ${convertToRem(23)};
  transition: 0.4s all ease-in-out;

  &:last-child {
    border-bottom: none;
  }

  h3,
  h4,
  p {
    transition: 0.4s all ease-in-out;
  }
  p,
  h3 {
    margin-bottom: 0;
  }
  .name_desc {
    h4 {
      color: ${Color.$PRIMARY};
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(17)};
      line-height: ${convertToRem(20)};
      letter-spacing: 0.04em;
      text-transform: capitalize;
    }
    p {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(13)};
      line-height: ${convertToRem(15)};
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
    }
  }

  .stocks {
    h3 {
      font-style: normal;
      font-weight: bold;
      font-size: ${convertToRem(16)};
      line-height: ${convertToRem(19)};
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
    }

    p {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(11)};
      line-height: ${convertToRem(13)};
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
    }
  }

  &:hover {
    background-color: ${Color.$PRIMARY};

    h3,
    h4,
    p {
      color: white;
    }
  }
`;
