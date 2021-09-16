import bxEditAlt from "@iconify-icons/bx/bx-edit-alt";
import organizationLine from "@iconify-icons/clarity/organization-line";
import paperclipIcon from "@iconify-icons/feather/paperclip";
import usersIcon from "@iconify-icons/feather/users";
import percent from "@iconify-icons/feather/percent";

import { ISupportedRoutes } from "../../../modal";

export interface ISettingRoutesSchema {
  tag: string;
  route: string;
  icon: any;
}

const root = `/app${ISupportedRoutes.SETTINGS}`;

export const settingRoutingScheam: ISettingRoutesSchema[] = [
  {
    tag: "Edit Profile",
    route: `${root}${ISupportedRoutes.PROFILE_SETTING}`,
    icon: bxEditAlt,
  },
  {
    tag: "Account Setting",
    route: `${root}${ISupportedRoutes.ACCOUNT_SETTING}`,
    icon: bxEditAlt,
  },
  {
    tag: "Organisation Details",
    route: `${root}${ISupportedRoutes?.Organizations}`,
    icon: organizationLine,
  },
  {
    tag: "Integrations",
    route: `${root}${ISupportedRoutes.INTEGRATIONS}`,
    icon: paperclipIcon,
  },
  {
    tag: "Tax Settings",
    route: `${root}${ISupportedRoutes.TAX}`,
    icon: percent,
  },
];
