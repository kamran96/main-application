import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Switch from 'react-router/Switch';
import { CommonLoader } from '@components';
import { useRbac } from '../components/Rbac/useRbac';

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => {
  return (
    <>
      {routes.map((route, i) => (
        <PrivateRoute key={i} route={route} i={i} extraProps={extraProps} />
      ))}
    </>
  );
};

const PrivateRoute = ({ route, i, extraProps = {}, switchProps = {} }) => {
  const { rbac } = useRbac(null);

  const [wait, setWait] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWait(false);
    }, 400);
  }, []);

  return (
    <Route
      key={route.key || i}
      path={route.path}
      exact={route.exact}
      strict={route.strict}
      render={(props) => {
        if (wait) {
          return (
            <div
              className="flex alignCenter justifyCenter"
              style={{ width: '100%', height: '100vh' }}
            >
              <CommonLoader />
            </div>
          );
        }
        if (!route.restricted) {
          return <route.component {...props} {...extraProps} route={route} />;
        } else if (route.restricted && rbac.can(route.permission)) {
          return <route.component {...props} {...extraProps} route={route} />;
        } else {
          const redirPath = '/app/405';
          return (
            <Redirect
              to={{ pathname: redirPath, state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default renderRoutes;
