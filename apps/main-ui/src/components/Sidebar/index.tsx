import chevronRight from "@iconify-icons/feather/chevron-right";
import Icon from "@iconify/react";
import { Tooltip } from "antd";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IThemeProps } from "../../hooks/useTheme/themeColors";
import { DivProps } from "../../modal";
import { IRouteChildren } from "../../modal/routing";
import { RoutingSchema } from "../../Schema/routingSchema";
import convertToRem from "../../utils/convertToRem";
import { Heading } from "../Heading";
import { useRbac } from "../Rbac/useRbac";
import { Seprator } from "../Seprator";
import { SidebarListItem } from "./SibebarListItem";
import { SidebarManager, useSidebarContext } from "./sidebarContext";

interface IProps {}

export const __Sidebar: FC<IProps> = () => {
  const { routeHistory } = useGlobalContext();
  const { rbac } = useRbac(null);
  const { toggle, setToggle } = useSidebarContext();

  return (
    <WrapperSidebar toggle={toggle} className="scroll-theme">
      <div onClick={() => setToggle(!toggle)} className="toggle">
        <Icon icon={chevronRight} />
      </div>
      <SidebarUl >
        <SidebarListItem sidebarItems={RoutingSchema.nestedRoutes} />
        {/* {RoutingSchema.nestedRoutes.map((item: IRoutesSchema, index) => {
          return <SidebarListItem key={`${index}`} item={item} />;
        })} */}
        <Seprator />
        <div className="head">
          <Heading type="normal" fontWeight="600">
            Create New
          </Heading>
        </div>
        {RoutingSchema.singleEntity.map((item: IRouteChildren, index) => {
          if (!item.permission || rbac.can(item.permission)) {
            return (
              <SingleRoute
                toggle={toggle}
                key={index}
                isActive={
                  routeHistory && routeHistory.location.pathname === item.route
                }
              >
                <Link key={item.route} className="link" to={item.route}>
                  <h4 className="flex alignCenter   ">
                    <i className="icon-styles mr-17 flex alginCenter">
                      <Tooltip
                        placement={toggle ? "top" : "right"}
                        title={`${item.tag}`}
                      >
                        <Icon style={{ fontSize: 17 }} icon={item.icon} />
                      </Tooltip>
                    </i>
                    <div className="tag_title"> {item.tag}</div>
                  </h4>
                </Link>
              </SingleRoute>
            );
          }
          return null;
        })}
      </SidebarUl>
    </WrapperSidebar>
  );
};

export const Sidebar = () => {
  return (
    <SidebarManager>
      <__Sidebar />
    </SidebarManager>
  );
};

const WrapperSidebar: any = styled.aside`
  /* position: fixed; */
  top: ${convertToRem(39)};
  height: calc(100vh - 28px);
  background: ${(props: IThemeProps) => props.theme.colors.sidebarBg};
  /* max-width:  */
  padding-top: ${convertToRem(32)};
  padding-bottom: ${convertToRem(52)};
  z-index: 1;
  transition: 0.4s all ease-in-out;
  left: 0;
  width: ${(props: IThemeProps) =>
    props?.toggle ? convertToRem(206) : convertToRem(65)};
  flex: 0 0
    ${(props: IThemeProps) =>
      props?.toggle ? convertToRem(206) : convertToRem(65)};
  overflow-x: hidden;
  overflow-y: auto;
  .head {
    position: relative;
    padding: 0.5rem 0.5rem 0.5rem 1.5625rem;
    visibility: ${(props: IThemeProps) =>
      props?.toggle ? "visible" : "hidden"};
    white-space: nowrap;
    opacity: ${(props: IThemeProps) => (props?.toggle ? "1" : "0")};
    left: ${(props: IThemeProps) => (props?.toggle ? "0" : convertToRem(-200))};
    transition: 0.4s all ease-in-out;
  }
  .toggle {
    position: fixed;
    z-index: 111;
    top: 44px;
    height: 30px;
    width: 30px;
    background: ${(props: IThemeProps) => props.theme.colors.layoutBg};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    font-size: 18px;
    border: 1px solid ${(props: IThemeProps) => props.theme.colors.$WHITE};
    color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
    box-shadow: 0px 0px 6px 0px transparent;
    cursor: pointer;
    left: ${(props: IThemeProps) => (props?.toggle ? `188px` : "48px")};
    transform: ${(props: IThemeProps) =>
      props?.toggle ? ` rotate(-180deg)` : ` rotate(0deg)`};
    transition: 0.4s all ease-in-out;
    &:hover {
      box-shadow: 0px 0px 6px 0px
        ${(props: IThemeProps) => props.theme.colors.$Secondary};
    }
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
  }
`;

const SidebarUl = styled.ul`
  list-style: none;
  padding: 0;
  position: relative;
`;

interface ISingleWrapperRouteProps{
  toggle: boolean,
  isActive: boolean
}

const SingleRoute = styled.li<ISingleWrapperRouteProps>`
  position: relative;
  font-style: normal;
  font-weight: normal;
  font-size: ${convertToRem(13)};
  background: ${(props: IThemeProps) =>
    props.isActive ? `${props.theme.colors.sidebarListActive}` : "transparent"};
  top: ${(props: IThemeProps) => (props?.toggle ? "0" : convertToRem(-40))};
  border-left: ${(props: IThemeProps) =>
    props.isActive
      ? `${convertToRem(2)} solid ${props.theme.colors.sidebarListActiveText}`
      : `${convertToRem(2)} solid transparent`};
  transition: 0.3s all ease-in-out;
  .link h4 {
    margin: ${convertToRem(2)} 0;
    padding: ${convertToRem(6)};
    color: ${(props: IThemeProps) =>
      props.isActive
        ? `${props.theme.colors.sidebarListActiveText}`
        : props.theme.colors.sidebarDefaultText};
    padding-left: ${convertToRem(25)};
    transition: 0.3s all ease-in-out;
    font-style: normal;
    font-weight: normal;
    font-size: ${convertToRem(14)};
    line-height: 134%;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  &:hover {
    background: ${(props: IThemeProps) => props.theme.colors.sidebarListActive};
    .link h4 {
      color: ${(props: IThemeProps) =>
        props.theme.colors.sidebarListActiveText};
    }
  }

  .tag_title {
    visibility: ${(props: IThemeProps) =>
      props?.toggle ? "visible" : "hidden"};
    white-space: nowrap;
    opacity: ${(props: IThemeProps) => (props?.toggle ? "1" : "0")};
    transition: 0.4s all ease-in-out;
  }
`;
