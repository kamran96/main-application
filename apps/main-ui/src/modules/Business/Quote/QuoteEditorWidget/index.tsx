import { Breadcrumb } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { BreadCrumbArea } from "../../../../components/BreadCrumbArea";
import { Heading } from "../../../../components/Heading";
import { PurchasesWidget } from "../../../../components/PurchasesWidget";
import { TableCard } from "../../../../components/TableCard";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { ISupportedRoutes } from "../../../../modal/routing";

interface IProps {}

export const QuoteEditorWidget: FC = () => {
  const [id, setId] = useState(null);

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  useEffect(() => {
    const quoteId = history.location.pathname.split("/app/create-quote/")[1];
    if (quoteId) {
      setId(parseInt(quoteId));
    }
  }, [history]);

  return (
    <WrapperQuoteWidget>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.QUOTE}`}>Quotes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Quuote</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <Heading>New Quote</Heading>
        <PurchasesWidget id={id} type="QO" />
      </TableCard>
    </WrapperQuoteWidget>
  );
};

const WrapperQuoteWidget = styled.div``;
