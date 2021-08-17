import React, { FC } from "react";
import { WrapperSalesOverview } from "./styles";
import { TableCard } from "../../../components/TableCard";
import { Heading } from "../../../components/Heading";
import { Seprator } from "../../../components/Seprator";

export const SalesOverview: FC = () => {
  return (
    <WrapperSalesOverview>
      <TableCard>
        <Heading type="table">Sales Overview</Heading>
        <Seprator />
      </TableCard>
    </WrapperSalesOverview>
  );
};
