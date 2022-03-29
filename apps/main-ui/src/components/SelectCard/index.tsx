import React, { FC, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Color, DivProps } from "../../modal";
import Icon from "@iconify/react";
import checkCircle from "@iconify-icons/fe/check-circle";

interface IProps {
  label: string;
  description: string;
  changedValue?(val: boolean): void;
  value?: boolean;
}

export const SelectCard: FC<IProps> = ({
  label,
  description,
  changedValue,
  value,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (value) {
      setIsChecked((prev) => {
        if (prev !== value) {
          return value;
        } else {
          return prev;
        }
      });
    }
  }, [value]);

  const handleChecked = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    changedValue(checked);
  };

  return (
    <WrapperSelectCard isChecked={isChecked}>
      <div>
        <h5 className="label">{label}</h5>
        <p className="description">{description}</p>
      </div>
      <div className="icon_area">
        <Icon className="icn" icon={checkCircle} />
      </div>
      <input
        checked={isChecked}
        onChange={handleChecked}
        className="select_input"
        type="checkbox"
        name="fruit-1"
        autoComplete="off"
      />
    </WrapperSelectCard>
  );
};

const popin = keyframes`
    0% {
        left: -150%
    }
    100%{
        left: 150%;
    }

`;

interface IWrapperSelectCardProps extends DivProps{
  isChecked: boolean
}

const WrapperSelectCard = styled.div<IWrapperSelectCardProps>`
  position: relative;
  /* background-color: ${(props: any) =>
    props.isChecked ? Color.$Secondary : Color.$WHITE}; */
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 14px 18px;
  transition: 0.3s all ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  overflow: hidden;
  border:2px solid ;
  border-color:${(props: any) =>
    props.isChecked ? Color.$Secondary : Color.$WHITE};

  &::after {
    position: absolute;
    content: "";
    left: -150%;
    top: 0;
    background:#1822500d;
    width: 100%;
    height: 100%;
    transform: skewX(45deg);
  }
  &:hover {
    &::after {
      animation: ${popin} 0.6s ease-in-out;
    }
  }

  .label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    text-transform: capitalize;
    /* color: ${(props: any) => (props.isChecked ? Color.$WHITE : Color.$BLACK)}; */
    margin: 0;
    transition: 0.3s all ease-in-out;
  }

  .description {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    text-transform: capitalize;
    margin: 0;
    transition: 0.3s all ease-in-out;
    /* color: ${(props: any) => (props.isChecked ? Color.$WHITE : Color.$BLACK)}; */
  }
  .select_input {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  .icon_area {
    color: ${(props: any) =>
      props.isChecked ? Color.$Secondary : Color.$CHECK_BOX};
    .icn {
      border-radius: 50%;
      background-color: white;
    }
  }
`;
