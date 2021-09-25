import React, { FC } from "react";

import { Heading } from "../../../components/Heading";
import { TableCard } from "../../../components/TableCard";
import { PayablesList } from "./PayablesList";
import { WrapperBillsToPay } from "./styles";

export const BillsToPay: FC = () => {
  return (
    <WrapperBillsToPay>
      <div className="pv-10">
        <Heading type="table">Bills to Pay</Heading>
      </div>
      <PayablesList />
    </WrapperBillsToPay>
  );
};
