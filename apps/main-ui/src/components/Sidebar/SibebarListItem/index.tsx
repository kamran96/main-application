/* eslint-disable jsx-a11y/anchor-is-valid */
import Icon from "@iconify/react";
import { Menu } from "antd";
import { DivProps } from "apps/main-ui/src/modal";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { IThemeProps } from "../../../hooks/useTheme/themeColors";
import { IRouteChildren, IRoutesSchema } from "../../../modal/routing";
import convertToRem from "../../../utils/convertToRem";
import { useRbac } from "../../Rbac/useRbac";
import { useSidebarContext } from "../sidebarContext";
// import "./sidebar.css";

const { SubMenu } = Menu;

interface IProps {
  sidebarItems: IRoutesSchema[];
  isActive?: boolean;
}

export const SidebarListItem: FC<IProps> = ({ sidebarItems }) => {
  const { routeHistory, darkMode } = useGlobalContext();
  const { history } = routeHistory;
  const { rbac } = useRbac(null);
  const { toggle } = useSidebarContext();

  const getActiveStatus = (item: IRoutesSchema) => {
    let found = false;
    if (item.route === history?.location?.pathname) {
      found = true;
    } else {
      for (let i = 0; i <= item?.children?.length - 1; i++) {
        if (item?.children[i]?.route === history?.location?.pathname) {
          found = true;
          break;
        } else {
          for (let j = 0; j <= item?.children[i]?.children?.length - 1; j++) {
            if (
              item.children[i].children[j]?.route ===
              history?.location?.pathname
            ) {
              found = true;
              break;
            } else {
              for (
                let k = 0;
                k <= item?.children[i]?.children[j].children?.length - 1;
                k++
              ) {
                if (
                  item?.children[i]?.children?.length?.[j] &&
                  item?.children[i]?.children[j]?.children[k]?.route ===
                    history?.location?.pathname
                ) {
                  found = true;
                }
              }
            }
          }
        }
      }
    }

    return found;
  };

  const filteredRoutes = (child: IRoutesSchema[]) => {
    let filtered = [];

    child.forEach((parent) => {
      if (parent.permission && rbac.can(parent.permission)) {
        filtered.push(parent);
      } else if (parent?.children?.length) {
        let subChildren = [];
        parent.children.forEach((firstChild) => {
          if (firstChild?.permission && rbac.can(firstChild.permission)) {
            subChildren.push(firstChild);
          } else if (firstChild?.children?.length) {
            let lastChildrens = firstChild.children.filter(
              (item) => !item.permission || rbac.can(item.permission)
            );
            subChildren.push({ ...firstChild, children: lastChildrens });
          } else if (!firstChild?.permission && !firstChild.children) {
            subChildren.push(firstChild);
          }
        });

        filtered.push({ ...parent, children: subChildren });
      } else if (!parent.permission && !parent?.children?.length) {
        filtered.push(parent);
      }
    });

    return filtered;
  };

  return (
    <WrapperNew toggle={toggle}>
      <Menu className="menu-wrapper" mode="vertical">
        {Array.isArray(filteredRoutes(sidebarItems)) &&
          filteredRoutes(sidebarItems).map(
            (child: IRoutesSchema, index: number) => {
              if (!child?.children?.length) {
                return (
                  <MenuItem
                    icon={
                      <Icon
                        style={{ fontSize: convertToRem(17) }}
                        className="mr-17 icon-styles"
                        icon={child.icon}
                      />
                    }
                    className={`custom-sub-menu without-child-routes ${
                      getActiveStatus(child)
                        ? `ant-menu-item-selected-item`
                        : ""
                    }`}
                    // onClick={() => history.push(child.route)}
                    key={`${child.tag}-${index}`}
                  >
                    <Link to={child.route}>{child.tag}</Link>
                  </MenuItem>
                );
              } else {
                return (
                  <PopupMenu
                    popupClassName={`popup-sidebar-child`}
                    onTitleClick={() => {
                      if (!child.children.length) {
                        history.push(child.route);
                      }
                    }}
                    className={`${
                      child.children.length ? `has-icon` : `icon-none`
                    } ${
                      getActiveStatus(child)
                        ? `ant-menu-submenu-selected-parent`
                        : ``
                    }`}
                    key={`${child.tag}-${index}`}
                    title={child.tag}
                    icon={
                      <Icon
                        style={{ fontSize: convertToRem(17) }}
                        className="mr-17 icon-styles"
                        icon={child.icon}
                      />
                    }
                  >
                    {child.children.map(
                      (subChild: IRouteChildren, index: number) => {
                        if (subChild.children) {
                          return (
                            <PopupMenu
                              popupClassName={
                                darkMode
                                  ? `dark-mode-popupmenu`
                                  : `light-mode-popupmenu`
                              }
                              key={`${subChild.tag}-${index}`}
                              title={subChild.tag}
                              className={`${
                                getActiveStatus(subChild)
                                  ? `ant-menu-submenu-selected-parent`
                                  : ``
                              }`}
                            >
                              {subChild.children.map(
                                (
                                  nestedChild: IRouteChildren,
                                  index: number
                                ) => {
                                  return (
                                    <MenuItem
                                      className={` custom-sub-menu ${
                                        getActiveStatus(nestedChild)
                                          ? `ant-menu-item-selected-item`
                                          : ""
                                      }`}
                                    >
                                      <Link to={nestedChild.route}>
                                        {nestedChild.tag}
                                      </Link>
                                    </MenuItem>
                                  );
                                }
                              )}
                            </PopupMenu>
                          );
                        } else {
                          return (
                            <MenuItem
                              className={`custom-sub-menu ${
                                getActiveStatus(subChild)
                                  ? `ant-menu-item-selected-item`
                                  : ""
                              }`}
                              key={`${subChild.tag}-${index}`}
                            >
                              <Link to={subChild.route}>{subChild.tag}</Link>
                            </MenuItem>
                          );
                        }
                      }
                    )}
                  </PopupMenu>
                );
              }
            }
          )}
      </Menu>
    </WrapperNew>
  );
};

interface IWrapperNewProps extends DivProps{
  toggle: boolean
}

const WrapperNew = styled.div<IWrapperNewProps>`
  .ant-menu {
    width: ${(props: IThemeProps) =>
      props?.toggle ? convertToRem(213) : convertToRem(74)};
    background: ${(props: IThemeProps) =>
      props.theme.colors.sidebarBg} !important;
    .ant-menu-submenu {
      background: ${(props: IThemeProps) => props.theme.colors.sidebarBg};

      .ant-menu-submenu-title {
        margin: 0.125rem 0;
        padding-top: 0 !important;
        color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
        padding-left: 1.5625rem;
        -webkit-transition: 0.3s all ease-in-out;
        font-style: normal;
        font-weight: normal;
        font-size: 0.875rem;
        line-height: 134%;
        -webkit-letter-spacing: 0.02em;
        -moz-letter-spacing: 0.02em;
        -ms-letter-spacing: 0.02em;
        letter-spacing: 0.02em;
        white-space: unset !important;
        transition: 0.4s all ease-in-out;
        /* display: flex; */
        /* align-items: center; */

        span {
          opacity: ${(props: IThemeProps) => (props?.toggle ? "1" : "0")};
          transition: 0.4s all ease-in-out;
        }
        svg {
          position: relative;
          top: 3px;
        }
      }

      &:hover {
        background: ${(props: IThemeProps) =>
          props.theme.colors.sidebarListActive};
        .ant-menu-submenu-title {
          color: ${(props: IThemeProps) =>
            props.theme.colors.sidebarListActiveText};
        }
      }
    }

    .without-child-routes {
      padding-left: 27px;
      display: flex;
      align-items: center;
      svg {
        margin-right: 14px;
      }
      span {
        transition: 0.4s all ease-in-out;
        opacity: ${(props: IThemeProps) => (props?.toggle ? "1" : "0")};
      }
    }

    .ant-menu-submenu-selected-parent {
      background: ${(props: IThemeProps) =>
        props.theme.colors.sidebarListActive};
      color: ${(props: IThemeProps) =>
        props.theme.colors.sidebarListActiveText};
      .ant-menu-submenu-title {
        color: ${(props: IThemeProps) =>
          props.theme.colors.sidebarListActiveText} !important;
        span {
          a {
            color: ${(props: IThemeProps) =>
              props.theme.colors.sidebarListActiveText};
          }
        }
      }
    }
  }

  .icon-none .ant-menu-submenu-title .ant-menu-submenu-arrow {
    display: none;
  }

  .has-icon .ant-menu-submenu-title .ant-menu-submenu-arrow {
    right: 26px;
    transition: 0.4s all ease-in-out;
    opacity: 0;
  }

  .has-icon:hover {
    .ant-menu-submenu-title .ant-menu-submenu-arrow {
      transition: 0.4s all ease-in-out;
      right: 16px;
      opacity: 1;
    }
  }

  .ant-menu-submenu-expand-icon,
  .ant-menu-submenu-arrow {
    color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
  }

  .ant-menu-vertical > .ant-menu-item,
  .ant-menu-vertical-left > .ant-menu-item,
  .ant-menu-vertical-right > .ant-menu-item,
  .ant-menu-inline > .ant-menu-item,
  .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    height: 33px;
    line-height: 33px;
    margin: 0;
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none !important;
  }

  .ant-menu-submenu-title {
    ${(props: IThemeProps) =>
      !props?.toggle && `text-overflow: unset !important`}
  }
`;

const MenuItem = styled(Menu.Item)`
  height: 35px;
  line-height: 35px;
  transition: 0.3s all ease-in-out !important;
  -webkit-transition: 0.3s all ease-in-out !important;
  -moz-transition: 0.3s all ease-in-out !important;
  -ms-transition: 0.3s all ease-in-out !important;
  -o-transition: 0.3s all ease-in-out !important;
  color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
  cursor: pointer;

  span a {
    color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
  }

  &:hover {
    background: ${(props: IThemeProps) => props.theme.colors.sidebarListActive};
    color: ${(props: IThemeProps) => props.theme.colors.sidebarListActiveText};
    span a {
      color: ${(props: IThemeProps) =>
        props.theme.colors.sidebarListActiveText} !important;
    }
  }
  ${(props: IThemeProps) =>
    props.className.includes("ant-menu-item-selected-item") &&
    `
 color: ${props.theme.colors.sidebarListActiveText} !important;
  background: ${props.theme.colors.sidebarListActive} !important;

  a{
    color: ${props.theme.colors.sidebarListActiveText} !important;
  }
`}
`;

export const PopupMenu = styled(SubMenu)`
  /* background: ${(props: IThemeProps) =>
    props.theme.colors.sidebarBg} !important; */
  .ant-menu {
    background: ${(props: IThemeProps) =>
      props.theme.colors.sidebarBg} !important;
    color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
  }
`;
