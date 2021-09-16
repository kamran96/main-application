/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import deleteIcon from "@iconify/icons-carbon/delete";
import bxsEdit from "@iconify/icons-bx/bxs-edit";
import convertToRem from "../../utils/convertToRem";
import { Color } from "../../modal";

interface IActionProps {
  componentType: "icon" | "text";
  type: "delete" | "edit" | "archive";
  onClick?: () => void;
  className?: string;
}

export const Action: FC<IActionProps> = ({
  componentType,
  type,
  onClick,
  className,
}) => {
  return (
    <WrapperAction className={className} onClick={onClick}>
      {componentType === "icon" ? (
        <i>
          <Icon
            style={{
              fontSize: convertToRem(20),
              color: Color.$GRAY,
              cursor: "pointer",
            }}
            icon={
              type === "delete" ? deleteIcon : type === "edit" ? bxsEdit : null
            }
          />
        </i>
      ) : (
        <a
          className={
            type === "delete" ? "delete" : type === "edit" ? "edit" : "archive"
          }
        >
          {type === "delete" ? "Delete" : type === "edit" ? "Edit" : "Archive"}
        </a>
      )}
    </WrapperAction>
  );
};

const WrapperAction = styled.div`
  .delete {
    color: ${Color.$THEME_RED};
  }
  .edit {
    color: ${Color.$PRIMARY};
  }
  .archive {
    color: ${Color.$LIGHT_BLACK};
  }
`;
