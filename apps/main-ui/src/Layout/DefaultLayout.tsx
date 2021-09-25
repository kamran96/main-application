import React from "react";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import { Redirect } from "react-router";
import { useGlobalContext } from "../hooks/globalContext/globalContext";

export const DefaultLayout = (props: RouteConfigComponentProps) => {
  const { isUserLogin, userDetails } = useGlobalContext();

  if (isUserLogin) {
    if (userDetails && userDetails.organizationId && userDetails.branchId) {
      return <Redirect to="/app/dashboard" />;
    } else {
      return <Redirect to="/app/organizations" />;
    }
  }
  return <>{renderRoutes(props.route.routes)}</>;
};
