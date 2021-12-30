import React, { useEffect } from 'react';
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router';
import { useGlobalContext } from '../hooks/globalContext/globalContext';
import { useHistory } from 'react-router-dom';

export const DefaultLayout = (props: RouteConfigComponentProps) => {
  const { isUserLogin, userDetails } = useGlobalContext();

  const history = useHistory();

  console.log(history, 'history');

  if (isUserLogin) {
    if (userDetails && userDetails.organizationId && userDetails.branchId) {
      const state: any = history.location.state;
      const route = state?.pathname || '/app/dashboard';
      return <Redirect to={route} />;
    } else {
      return <Redirect to="/app/organizations" />;
    }
  }
  return <>{renderRoutes(props.route.routes)}</>;
};
