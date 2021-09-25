import { Button } from "antd";
import React, { FC } from "react";
import styled from "styled-components";

import { Heading } from "../../../components/Heading";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { ISupportedRoutes } from "../../../modal/routing";
import { QuoteList } from "./QuoteList";

export const QuotesContainer: FC = () => {
  const { routeHistory } = useGlobalContext();

  const { history } = routeHistory;
  return (
    <WrapperQuotes>
      <div className="flex alginCenter justifySpaceBetween pv-10">
        <Heading type="table">Quotes</Heading>
        <Button
          onClick={() => history.push(`/app${ISupportedRoutes.CREATE_QUOTE}`)}
          type="primary"
          size="middle"
        >
          New Quote
        </Button>
      </div>
      <QuoteList />
    </WrapperQuotes>
  );
};

export const WrapperQuotes = styled.div``;
