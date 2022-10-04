import { RouteConfig } from 'react-router-config';
import { ContactsContainer } from '..';
import { ISupportedRoutes } from '@invyce/shared/types';
import { ContactsEditorWidget } from '../ContactsEditorWiget';

export const ContactsManagerRoutes = (root): RouteConfig[] => [
  {
    path: root,
    component: ContactsContainer,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.CREATE_CONTACT}`,
    component: ContactsEditorWidget,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.UPDATE_CONTACT}/:id`,
    component: ContactsEditorWidget,
    exact: true,
  },
];
