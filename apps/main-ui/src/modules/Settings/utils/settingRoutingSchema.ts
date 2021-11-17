import { Rbac } from './../../../components/Rbac/index';
import bxEditAlt from '@iconify-icons/bx/bx-edit-alt';
import organizationLine from '@iconify-icons/clarity/organization-line';
import paperclipIcon from '@iconify-icons/feather/paperclip';
import usersIcon from '@iconify-icons/feather/users';
import percent from '@iconify-icons/feather/percent';
import Lock from '@iconify-icons/feather/lock';
import Bullet from '@iconify-icons/feather/list';
import Eye from '@iconify-icons/feather/eye';

import { ISupportedRoutes } from '../../../modal';

export interface ISettingRoutesSchema {
  tag: string;
  route: string;
  icon: any;
}

const root = `/app${ISupportedRoutes.SETTINGS}`;

export const settingRoutingScheam: ISettingRoutesSchema[] = [
  {
    tag: 'Edit Profile',
    route: `${root}${ISupportedRoutes.PROFILE_SETTING}`,
    icon: bxEditAlt,
  },
  {
    tag: 'Account Setting',
    route: `${root}${ISupportedRoutes.ACCOUNT_SETTING}`,
    icon: bxEditAlt,
  },
  {
    tag: 'Organisation Details',
    route: `${root}${ISupportedRoutes?.Organizations}`,
    icon: organizationLine,
  },
  {
    tag: 'Users',
    route: `${root}${ISupportedRoutes?.USERS}`,
    icon: organizationLine,
  },
  {
    tag: 'Integrations',
    route: `${root}${ISupportedRoutes.INTEGRATIONS}`,
    icon: paperclipIcon,
  },
  {
    tag: 'Tax Settings',
    route: `${root}${ISupportedRoutes.TAX}`,
    icon: percent,
  },
  {
    tag: 'Permissions',
    route: `${root}${ISupportedRoutes.PERMISSIONS}`,
    icon: Eye,
  },
  {
    tag: 'Role',
    route: `${root}${ISupportedRoutes.RBAC}`,
    icon: Bullet,
  },
  {
    tag: 'Permissions Settings',
    route: `${root}${ISupportedRoutes.PERMISSION_SETTINGS}`,
    icon: Lock,
  },
];
