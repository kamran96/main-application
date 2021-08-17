import React, { FC } from "react";
import styled from "styled-components";
import { Heading } from "../../components/Heading";
import { TableCard } from "../../components/TableCard";

export const Branch: FC = () => {
  return (
    <WrapperBranch>
      <TableCard>
        <Heading>Branches</Heading>
      </TableCard>
    </WrapperBranch>
  );
};

const WrapperBranch = styled.div``;
