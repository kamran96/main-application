import {
  PopOverListWrapper,
  PopupGlobalStyles,
  SidebarWrapper,
} from './styles';
import { Avatar, Button, Popover } from 'antd';
import { IRoutesSchema, IRoutingSchema } from '@invyce/shared/types';
import { FC, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icon from '@iconify/react';
import { ReactElement, useState } from 'react';
import { AppLogoWithoutText, InyvceDarkTextIcon } from './applogo';
import sidebarCollapse24 from '@iconify/icons-octicon/sidebar-collapse-24';
import LogOut from '@iconify-icons/feather/log-out';
import Sun from '@iconify-icons/feather/sun';
import Moon from '@iconify-icons/feather/moon';
import { UserOutlined } from '@ant-design/icons';
/* eslint-disable-next-line */

export interface IActiveUserInfo {
  username: string;
  userEmail: string;
  userId?: number;
  userImage: string;
  theme?: 'dark' | 'light';
  link?: string;
}

export interface SidebarUiProps {
  activeUserInfo: IActiveUserInfo;
  routes: IRoutingSchema;
  appLogo?: ReactElement<any>;
  onLogOut?: () => void;
  onThemeButtonClick?: () => void;
  userOnline?: boolean;
}

interface IPopOverProps {
  route: IRoutesSchema;
}
const MenuPopOver: FC<IPopOverProps> = ({ route }) => {
  const history = useHistory();

  const _activeIndex: any = route?.children?.findIndex(
    (i) => i?.route === history?.location?.pathname
  );

  const content = (
    <PopOverListWrapper className="popover_list ">
      {route?.children?.map((childRoute, index) => {
        return (
          <li
            key={index}
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
        overlayClassName={'open_popover'}
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

export const SidebarUi: FC<SidebarUiProps> = ({
  activeUserInfo,
  routes,
  onLogOut,
  onThemeButtonClick,
  userOnline,
  appLogo,
}) => {
  const history = useHistory();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleCached: null | string = localStorage?.getItem('isToggle') || null;

  useEffect(() => {
    if (toggleCached) {
      setSidebarOpen(JSON.parse(toggleCached));
    }
  }, [toggleCached]);

  return (
    <SidebarWrapper toggle={sidebarOpen}>
      <div className="logo_area flex alignCenter">
        <span>{sidebarOpen ? appLogo : <AppLogoWithoutText />} </span>
        <span
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            localStorage.setItem('isToggle', JSON.stringify(!sidebarOpen));
          }}
          className="collapse pointer"
        >
          <Icon className="fs-20" icon={sidebarCollapse24} />
        </span>
      </div>
      <hr className="mt-10" />
      <div
        onClick={() => {
          if (activeUserInfo?.link) {
            history?.push(activeUserInfo.link);
          }
        }}
        className="sidebar-userinfo flex alignCenter pointer ph-10"
      >
        <div className="avatar_area">
          {activeUserInfo?.userImage ? (
            <Avatar
              className="user_avatar"
              size={41}
              src={activeUserInfo?.userImage}
            />
          ) : (
            <Avatar
              size={41}
              className="user_avatar flex alignCenter justifyCenter"
              icon={<UserOutlined size={28} />}
            />
          )}
        </div>
        <div className="sidebar_userinfo_detail ml-10  route_tag">
          <div>
            {' '}
            <h4 className="capitalize fs-14 fw-500 m-reset">
              {activeUserInfo?.username}
            </h4>
            <span className={` online-check flex alignCenter fs-13 fw-500`}>
              <div
                className={`dot  ${userOnline ? 'online' : 'offline'}`}
              ></div>
              {userOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      <div className="routes mt-10">
        <div className="main_routes">
          <ul className="route_list">
            {routes?.nestedRoutes?.map((parent, index) => {
              return (
                <div key={index}>
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
                </div>
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
                    key={index}
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
      <div className="sidebar_bottom">
        <li
          className={`route_list_item theme_changer flex alignCenter pointer mv-4   
                    `}
        >
          <Button
            onClick={onThemeButtonClick}
            className="theme_button"
            type="default"
          >
            <span className="mr-10 flex alignCenter">
              <Icon
                className=" fs-16  icon"
                icon={activeUserInfo?.theme === 'dark' ? Moon : Sun}
              />
            </span>
            <span className="title">
              {activeUserInfo?.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </Button>
        </li>
        <li
          onClick={onLogOut}
          className={`route_list_item flex alignCenter pointer mv-4   
                    `}
        >
          <span className="mr-10 flex alignCenter">
            <Icon className=" fs-16  icon" icon={LogOut} />
          </span>
          <span className="route_tag">Log Out</span>
        </li>
      </div>
    </SidebarWrapper>
  );
};

export default SidebarUi;
