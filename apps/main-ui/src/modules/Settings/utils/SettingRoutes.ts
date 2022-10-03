import { PermissionsContainer } from './../../Rbac/Permisions/index';
import { UsersContainer } from './../../Users/index';
import { ProfileSettings } from './../ProfileSettings/index';
import { RouteConfig } from 'react-router-config';
import { ISupportedRoutes } from '@invyce/shared/types';
import { Integrations } from '../Integrations';
import { Redirect } from './Redirect';
import { AccountSettings } from '../AccountSettings';
import { TaxSettings } from '../TaxSettings';
import { RbacContainer } from '../../Rbac';
import { PermissionsSettingsContainer } from '../../Rbac/Permisions/settings';
import { Organizations } from '../../../Containers/AddOrganization/index';

export const SettingRoutes = (root): RouteConfig[] => [
  {
    path: root,
    component: Redirect,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.PROFILE_SETTING}`,
    component: ProfileSettings,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.ACCOUNT_SETTING}`,
    component: AccountSettings,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.INTEGRATIONS}`,
    component: Integrations,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.TAX}`,
    component: TaxSettings,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.RBAC}`,
    component: RbacContainer,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.PERMISSIONS}`,
    component: PermissionsContainer,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.PERMISSION_SETTINGS}`,
    component: PermissionsSettingsContainer,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.USERS}`,
    component: UsersContainer,
    exact: true,
  },
  {
    path: `${root}${ISupportedRoutes.Organizations}`,
    component: Organizations,
    exact: true,
  },
  // {
  //   path: `${root}${ISupportedRoutes.CREATE_CONTACT}`,
  //   component: ContactsEditorWidget,
  //   exact: true,
  // },
  // {
  //   path: `${root}${ISupportedRoutes.UPDATE_CONTACT}/:id`,
  //   component: ContactsEditorWidget,
  //   exact: true,
  // },
];
