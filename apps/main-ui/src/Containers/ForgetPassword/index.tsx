import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { EmailForm } from "./EmailForm";
import { ResetForm } from "./ResetForm";

export const ForgotPassowrdContainer = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory?.history;

  if (location?.search?.includes("type=reset-password")) {
    return <ResetForm />;
  } else {
    return <EmailForm />;
  }
};
