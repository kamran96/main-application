import React, { FC, useEffect, useState } from "react";
import addLine from "@iconify/icons-ri/add-line";
import { Icon } from "@iconify/react";
import { Button } from "antd";

import { Heading } from "../../components/Heading";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { AccountsList } from "./AccountsList";
import { columns, data } from "./AccountsList/var";
import AccountingWrapper, { Header } from "./styles";
import { Rbac } from "../../components/Rbac";
import { PERMISSIONS } from "../../components/Rbac/permissions";

export const Accounts: FC = () => {
  const [accountsList, setAccountsList] = useState([]);
  const { setAccountsModalConfig } = useGlobalContext();
  useEffect(() => {
    setAccountsList(data);
  }, []);

  return (
    <AccountingWrapper>
      {/* <TableCard> */}
      <Header>
        <Heading type={"table"}>Chart of Accounts</Heading>
        <div className="addAccount flex alignCenter pv-10 justifyFlexEnd">
          <Rbac permission={PERMISSIONS.ACCOUNTS_CREATE}>
            <Button
              type="primary"
              onClick={() =>
                setAccountsModalConfig({ visibility: true, id: null })
              }
            >
              <span className="icon-left flex alignCenter">
                <Icon icon={addLine} />
              </span>{" "}
              Add Account{" "}
            </Button>
          </Rbac>
        </div>
      </Header>
      <AccountsList data={accountsList} columns={columns} />
      {/* </TableCard> */}
    </AccountingWrapper>
  );
};
