import React, { FC, useCallback, useEffect, useState } from "react";

interface IProps {
  onClickOutSide?: () => void;
  children?: React.ReactElement<any>;
  initialVal?: boolean;
  timeout?: number;
  notEffectingClass?: string;
}

export const ClickOutSide: FC<IProps> = ({
  children,
  onClickOutSide,
  initialVal,
  timeout = 0,
  notEffectingClass,
}) => {
  useEffect(() => {
    handleOutsideClick();
  });

  const handleOutsideClick = useCallback(() => {
    const body: any = document.querySelector("body");
    // document.addEventListener
    if (body && initialVal && initialVal === true) {
      body.addEventListener("click", (e) => {
        if (e?.target?.className !== notEffectingClass) {
          setTimeout(() => {
            onClickOutSide();
          }, timeout);
        }
      });
    }
  }, [initialVal, onClickOutSide]);

  return <>{children}</>;
};
export default ClickOutSide;
