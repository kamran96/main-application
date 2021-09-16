import React from "react";
import { useRbac } from "../components/Rbac/useRbac";
import { Redirect } from "react-router-dom";

export const PrivateRoutes = (children, premission) => {
  const { can } = useRbac(premission);

  if (false) {
    return children;
  } else {
    return <Redirect to="/app/abcd" />;
  }
};
