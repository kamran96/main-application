import React, { FC } from 'react';
import { Redirect as RedirectRoute } from 'react-router-dom';
import { ISupportedRoutes } from '@invyce/shared/types';

export const Redirect: FC = () => {
  return (
    <RedirectRoute
      to={`/app${ISupportedRoutes.SETTINGS + ISupportedRoutes.PROFILE_SETTING}`}
    />
  );
};
