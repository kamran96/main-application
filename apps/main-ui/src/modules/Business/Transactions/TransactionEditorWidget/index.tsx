import { Breadcrumb } from "antd";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { BreadCrumbArea } from "../../../../components/BreadCrumbArea";
import { ISupportedRoutes } from "../../../../modal/routing";
import { TransactionWidget } from "./editor";

export const JournalEditor: FC = () => {
  return (
    <WrapperJournalEditor>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.TRANSACTIONS}`}>
              Journal Entries
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Journal Entry</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TransactionWidget />
    </WrapperJournalEditor>
  );
};

const WrapperJournalEditor = styled.div``;
