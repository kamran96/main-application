import React from 'react';
import { Redirect } from 'react-router-dom';

export const RedirectToLogin = () => {
  return (
    <Redirect
      from="/"
      to={{
        pathname: '/page/login',
      }}
    />
  );
};
