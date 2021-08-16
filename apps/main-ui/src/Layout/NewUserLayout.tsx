import React, { SFC } from "react";
import { DashboardWrapper } from "./DashboardStyles";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import { AppLayout } from "./AppLayout";
import {  useGlobalContext } from "../hooks/globalContext/globalContext";
import { Redirect } from 'react-router-dom';
import { AddOrganizationForm } from "../Containers/AddOrganization/AddOrganizationForm";

 const DashboardLayout: SFC = (props: RouteConfigComponentProps) => {
  const {isUserLogin, userDetails} = useGlobalContext();
  if (!isUserLogin) {
    return <Redirect to="/page/login" />;
  }
  // if(!isUserLogin && userDetails.)
  return (
    <DashboardWrapper>
        <AppLayout>{renderRoutes(props.route.routes)}</AppLayout>
        <AddOrganizationForm/>
    </DashboardWrapper>
  );
};
