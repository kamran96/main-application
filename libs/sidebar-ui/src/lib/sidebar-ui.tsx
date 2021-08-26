import {
  PopOverListWrapper,
  PopupGlobalStyles,
  SidebarWrapper,
} from './styles';
import { Avatar, Popover } from 'antd';
import { IRoutesSchema, IRoutingSchema } from '@invyce/shared/types';
import { FC } from 'hoist-non-react-statics/node_modules/@types/react';
import { Link, useHistory } from 'react-router-dom';
import Icon from '@iconify/react';
import { ReactElement, useState } from 'react';
import { AppLogoWithoutText, InyvceDarkTextIcon } from './applogo';
import sidebarCollapse24 from '@iconify/icons-octicon/sidebar-collapse-24';
/* eslint-disable-next-line */

export interface IActiveUserInfo {
  username: string;
  userEmail: string;
  userId?: number;
  userImage: string;
  theme?: 'dark' | 'light';
}

export interface SidebarUiProps {
  activeUserInfo: IActiveUserInfo;
  routes: IRoutingSchema;
  appLogo?: ReactElement<any>;
}

interface IPopOverProps {
  route: IRoutesSchema;
}
const MenuPopOver: FC<IPopOverProps> = ({ route }) => {
  const history = useHistory();

  let _activeIndex: any = route?.children?.findIndex(
    (i) => i?.route === history?.location?.pathname
  );

  const content = (
    <PopOverListWrapper className="popover_list ">
      {route?.children?.map((childRoute, index) => {
        return (
          <li
            className={`popover_list_item mv-4 ${
              _activeIndex === index ? 'active_child' : ''
            }`}
          >
            <Link
              className="fs-14"
              key={index}
              to={childRoute?.route as string}
            >
              {childRoute?.tag}
            </Link>
          </li>
        );
      })}
    </PopOverListWrapper>
  );

  return (
    <>
      <PopupGlobalStyles />
      <Popover
        className="open_wrapper"
        placement="rightTop"
        content={content}
        title={false}
      >
        <li
          className={`route_list_item_parent flex alignCenter pointer fs-14 ${
            _activeIndex > -1 ? 'active_route' : ''
          }`}
        >
          <span className="mr-10 flex alignCenter">
            <Icon className=" icon fs-16" icon={route?.icon} />
          </span>

          <span className="route_tag">{route?.tag}</span>
        </li>
      </Popover>
    </>
  );
};

export const SidebarUi: FC<SidebarUiProps> = ({ activeUserInfo, routes }) => {
  const history = useHistory();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarWrapper theme={activeUserInfo?.theme} toggle={sidebarOpen}>
      <div className="logo_area flex alignCenter">
        <span>
          {sidebarOpen ? <InyvceDarkTextIcon /> : <AppLogoWithoutText />}{' '}
        </span>
        <span onClick={()=> {
          setSidebarOpen(!sidebarOpen);
        }}  className="collapse pointer"><Icon className="fs-25" icon={sidebarCollapse24} /></span>
      </div>
      <hr className="mt-10"/>
      <div className="sidebar-userinfo flex alignCenter ph-10">
        <div className="avatar_area">
          <Avatar
            className="user_avatar"
            size={41}
            src={activeUserInfo?.userImage}
          />
        </div>
        <div className="sidebar_userinfo_detail ml-10 ">
          <h4 className="capitalize fs-14 fw-500 m-reset">
            {activeUserInfo?.username}
          </h4>
          <h6 className="fs-11">{activeUserInfo?.userEmail}</h6>
        </div>
      </div>
      <div className="routes mt-10">
        <div className="main_routes">
          <ul className="route_list">
            {routes?.nestedRoutes?.map((parent, index) => {
              return (
                <>
                  {parent?.children?.length ? (
                    <MenuPopOver route={parent} />
                  ) : (
                    <li
                      className={`route_list_item flex alignCenter pointer mv-4
                    ${
                      history?.location?.pathname === parent?.route
                        ? 'active_route'
                        : ''
                    }
                    `}
                    >
                      <Link
                        className="flex alignCenter fs-14"
                        to={parent?.route as string}
                      >
                        <span className="mr-10 flex alignCenter">
                          <Icon className=" fs-16  icon" icon={parent?.icon} />
                        </span>
                        <span className="route_tag">{parent?.tag}</span>
                      </Link>
                    </li>
                  )}
                </>
              );
            })}
          </ul>
        </div>
        <hr className="seprator mt-20" />
        <div className="quickaccess_routes">
          <h5 className="ph-24 fs-13 head">Create New</h5>
          <div className="mt-10">
            <ul className="route_list">
              {routes?.singleEntity?.map((singleEntryRoute, index) => {
                return (
                  <li
                    className={`route_list_item flex alignCenter pointer mv-4 
                    ${
                      history?.location?.pathname === singleEntryRoute?.route
                        ? 'active_route'
                        : ''
                    }
                    `}
                  >
                    <Link
                      className="flex alignCenter fs-14"
                      to={singleEntryRoute?.route as string}
                    >
                      <span className="mr-10 flex alignCenter">
                        <Icon
                          className=" fs-16  icon"
                          icon={singleEntryRoute?.icon}
                        />
                      </span>
                      <span className="route_tag">{singleEntryRoute?.tag}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default SidebarUi;
