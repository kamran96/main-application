import React, { FC } from "react";

import { Heading } from "../../../components/Heading";
import { TableCard } from "../../../components/TableCard";
import { AccountsSettingsForm } from "./Form/Form";
import { WrapperAccountSettings } from "./styles";

export const AccountSettings: FC = () => {
  return (
    <WrapperAccountSettings>
      <TableCard>
        <Heading type="table">Account</Heading>
        <AccountsSettingsForm />
      </TableCard>
    </WrapperAccountSettings>
  );
};
