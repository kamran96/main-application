import { ProfileSettings } from "./../ProfileSettings/index";
import { RouteConfig } from "react-router-config";
import { ISupportedRoutes } from "../../../modal";
import { Integrations } from "../Integrations";
import { Redirect } from "./Redirect";
import { AccountSettings } from "../AccountSettings";
import { TaxSettings } from "../TaxSettings";

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
