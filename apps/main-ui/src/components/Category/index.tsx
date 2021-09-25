/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from "react";
// import Avatar from "react-avatar";
// import AttributeIcon from "src/assets/images/alignCenter.svg";
// import AngleRight from "src/assets/images/angle-right.svg";
import { ICategory } from "../../modal/categories";
import styled from "styled-components";
import { Avatar } from "antd";

export interface IProps {
  category: ICategory;
  onClick(): void;
  addAttributes: (payload: any) => void;
}

export const CategoryListItem: FC<IProps> = ({
  category,
  onClick,
  addAttributes,
}) => {
  return (
    <CategoryListItemWrapper onClick={onClick}>
      <div
        className={`CategoryListItemsParent  ${
          category.isActive ? `isActive` : `notActive`
        }`}
      >
        <div className="CategoryListItems">
          <Avatar size={30}>{category.title}</Avatar>
          <p className="category-text">{category.title}</p>| {category.id} |{" "}
          {category.parent_id}
        </div>
        <a className="leaf_category">
          {category.is_leaf ? (
            "icon"
          ) : (
            // <img
            //   onClick={() => addAttributes(category)}
            //   className="leaf_categoryIcon"
            //   src={AttributeIcon}
            //   alt="icon"
            // />
            <>right</>
            // <img className="leaf_categoryIcon" src={AngleRight} alt="icon" />
          )}
        </a>
      </div>
    </CategoryListItemWrapper>
  );
};

const CategoryListItemWrapper = styled.div`
  .CategoryListItemsParent {
    display: flex;
    align-items: center;
    padding: 12px 13px;
    transition: 0.4s all ease-in-out;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: #f8f8f8;
    }
  }

  .CategoryListItems {
    display: flex;
    align-items: center;
    transition: 0.4s all ease-in-out;
    align-items: center;
    flex: 1;
  }

  .isActive {
    background: #dfdfdf;
  }

  .category-text {
    font-size: 16px;
    font-weight: 500;
    color: rgba(82, 82, 82, 0.85);
    margin: 0;
    padding: 0 10px;
  }

  .leaf_categoryIcon {
    height: 14px;
    width: 14px;
  }
`;
