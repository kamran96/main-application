import React, { FC } from "react";
import { WrapperItems } from "./styles";
import { ItemsList } from "./ItemsList/ItemsList";

export const Items: FC = () => {
  return (
    <WrapperItems>
      <ItemsList />
    </WrapperItems>
  );
};
