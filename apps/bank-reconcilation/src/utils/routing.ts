import { BanksLayout } from '../layout/banks-layout';
import { Banks } from '../app/containers/banks';
import { RouteConfig } from 'react-router-config';

export const routes = (): RouteConfig => [
  {
    component: BanksLayout,
    routes: [
      {
        path: '/',
        component: Banks,
      },
    ],
  },
];
