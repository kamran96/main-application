import {
  PopOverListWrapper,
  PopupGlobalStyles,
  SidebarWrapper,
} from './styles';
import { Avatar, Button, Popover } from 'antd';
import { IRoutesSchema, IRoutingSchema } from '@invyce/shared/types';
import { FC, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ReactElement, useState, Fragment } from 'react';
import { AppLogoWithoutText } from './applogo';
import chevronRight from '@iconify/icons-carbon/chevron-right';
import chevronUp from '@iconify/icons-carbon/chevron-up';
import Icon from '@iconify/react';
import { UserOutlined } from '@ant-design/icons';
import chevronDown from '@iconify/icons-carbon/chevron-down';
import LogOut from '@iconify-icons/feather/log-out';
import Setting from '@iconify-icons/feather/settings';
import Sun from '@iconify-icons/feather/sun';
import Moon from '@iconify-icons/feather/moon';

export interface IActiveUserInfo {
  username: string;
  userEmail: string;
  userId?: number;
  userImage: string;
  theme?: 'dark' | 'light';
  link?: string;
  userRole: string;
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
          className={`route_list_item_parent flex alignCenter pointer fs-14  ${
            _activeIndex > -1 ? 'active_route' : ''
          }`}
        >
          <span className="mr-10 flex alignCenter icon">{route?.icon}</span>
          <span className="route_tag ">{route?.tag}</span>
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
  const [openNavAncorIndex, setOpenNavAncorIndex] = useState<number | null>(
    null
  );

  const toggleCached: null | string = localStorage?.getItem('isToggle') || null;
  useEffect(() => {
    if (toggleCached) {
      setSidebarOpen(JSON.parse(toggleCached));
    }
  }, [toggleCached]);

  const handleShowSubMenu = (e: any, index: number) => {
    e.preventDefault();
    setOpenNavAncorIndex((prev) => {
      if (prev === index) {
        return null;
      } else {
        return index;
      }
    });
  };

  return (
    <SidebarWrapper toggle={sidebarOpen}>
      <div className="toggle">
        <span
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            localStorage.setItem('isToggle', JSON.stringify(!sidebarOpen));
          }}
          className="collapse pointer"
        >
          <Icon className="fs-20" icon={chevronRight} />
        </span>
      </div>
      <div className="sidebar_wrapper">
        <div className="logo_area flex alignCenter mt-5">
          <span>{sidebarOpen ? appLogo : <AppLogoWithoutText />} </span>
        </div>

        <hr className="mt-10" />
        <div
          onClick={() => {
            if (activeUserInfo?.link) {
              history?.push(activeUserInfo.link);
            }
          }}
          className="sidebar-userinfo flex alignCenter  pointer ph-10"
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
          <div className=" userDetail_area ml-12  mt-10 route_tag">
            <div>
              {' '}
              <h4 className="capitalize fs-14 fw-500 m-reset">
                {activeUserInfo?.username}
              </h4>
              <span className={` online-check flex alignCenter fs-13 fw-500`}>
                <h5 className="capitalize">{activeUserInfo?.userRole}</h5>
              </span>
            </div>
          </div>
        </div>

        <div className="routes mt-10">
          <div className="main_routes">
            <ul className="route_list">
              {routes?.nestedRoutes?.map((parent, index) => {
                return (
                  <Fragment key={index}>
                    {!sidebarOpen && parent?.children?.length ? (
                      <MenuPopOver route={parent} />
                    ) : !parent?.children?.length ? (
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
                          <span className="mr-10 flex alignCenter icon">
                            {parent?.icon}
                          </span>
                          <span className="route_tag">{parent?.tag}</span>
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <div
                          className={`route_list_item_parent sub_route_parent flex alignCenter justifySpaceBetween pointer mv-6 ${
                            index === openNavAncorIndex ? 'active_route' : ''
                          }`}
                          onClick={(e) => handleShowSubMenu(e, index)}
                        >
                          <span className="flex alignCenter justifySpaceBetween">
                            <span className="mr-10 flex alignCenter icon">
                              {parent?.icon}
                            </span>
                            <span className="route_tag">{parent?.tag}</span>
                          </span>
                          <Icon
                            className="fs-16 arrow"
                            icon={
                              index !== openNavAncorIndex || !openNavAncorIndex
                                ? chevronDown
                                : chevronUp
                            }
                          />
                        </div>
                        <div
                          className={`submenu_container ${
                            index === openNavAncorIndex
                              ? 'open-anchor'
                              : 'close-anchor'
                          }`}
                        >
                          <ul>
                            {parent?.children.map(
                              (item: any, index: number) => {
                                return (
                                  <li
                                    key={index}
                                    className={` pointer ${
                                      history?.location?.pathname ===
                                      item?.route
                                        ? 'active_route'
                                        : ''
                                    }`}
                                  >
                                    <Link to={item?.route}>
                                      <span>{item?.tag}</span>
                                    </Link>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      </li>
                    )}
                  </Fragment>
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
                        <span className="mr-10 flex alignCenter icon">
                          {singleEntryRoute?.icon}
                        </span>
                        <span className="route_tag">
                          {singleEntryRoute?.tag}
                        </span>
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
            className={`route_list_item theme_changer flex alignCenter pointer
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
            onClick={() => {
              history.push({
                pathname: `/app/settings/profile-settings`,
                state: {
                  from: history.location.pathname,
                },
              });
            }}
            className={`route_list_item flex alignCenter pointer   
                    `}
          >
            <span className="mr-10 flex alignCenter">
              <Icon className=" fs-16  icon" icon={Setting} />
            </span>
            <span className="route_tag">Setting</span>
          </li>
          <li
            onClick={onLogOut}
            className={`route_list_item flex alignCenter pointer   
                    `}
          >
            <span className="mr-10 flex alignCenter">
              <Icon className=" fs-16  icon" icon={LogOut} />
            </span>
            <span className="route_tag">Log Out</span>
          </li>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default SidebarUi;
