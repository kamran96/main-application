/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { IRouteChildren, IRoutesSchema } from "../../../modal/routing";
import { Link } from "react-router-dom";
import { Color } from "../../../modal";
import convertToRem from "../../../utils/convertToRem";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import Icon from "@iconify/react";
import { Popover, Tooltip } from "antd";
import arrowRight from "@iconify-icons/fe/arrow-right";
import { useRbac } from "../../Rbac/useRbac";

interface IProps {
  item: IRoutesSchema;
  isActive?: boolean;
}

export const SidebarListItem: FC<IProps> = ({ item }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    handleOutsideClick();
  });
  const handleOutsideClick = useCallback(() => {
    const body: any = document.querySelector("body");
    if (body && isVisible) {
      body.addEventListener("click", () => {
        setIsVisible(false);
      });
    }
  }, [isVisible]);

  const { rbac } = useRbac(null);

  let children =
    item.children.length &&
    item.children.filter(
      (child) => !child.permission || rbac.can(child.permission)
    );

  const { routeHistory, toggle } = useGlobalContext();

  useEffect(() => {
    setIsVisible(false);
  }, [routeHistory]);

  let isParentActive =
    item.children.filter(
      (child) => child.route === routeHistory.location.pathname
    ).length > 0;

  const renderSidebarWrapper = () => {
    return (
      <SidebarListItemWrapper
        toggle={toggle}
        onClick={() => {
          if (children) {
            setIsVisible((prev) => {
              if (prev !== true) {
                return true;
              } else {
                return prev;
              }
            });
          }
        }}
        parentActive={
          routeHistory.location.pathname === item.route ? true : isParentActive
        }
      >
        {!children && item.route ? (
          <SingleRoute item={item} toggle={toggle} />
        ) : children.length ? (
          <Popover
            // visible={isVisible}
            placement="rightTop"
            content={
              <>
                {item.children.length > 0 && (
                  <WrapperPopoverContent className={`children`}>
                    <ul>
                      {children &&
                        children.map((child: IRouteChildren, index) => {
                          return (
                            <SidebarChildren
                              child={child}
                              index={index}
                              routeHistory={routeHistory}
                            />
                          );
                        })}
                    </ul>
                  </WrapperPopoverContent>
                )}
              </>
            }
            trigger="click"
          >
            <a className={`d-block tab`}>
              <div className={`flex alignCenter justifySpaceBetween`}>
                <h4 className="flex alignCenter ">
                  <i className="icon-styles mr-17 flex alginCenter fs-15">
                    <Tooltip
                      placement={toggle ? "top" : "right"}
                      title={`${item.tag}`}
                    >
                      <Icon style={{ fontSize: 17 }} icon={item.icon} />
                    </Tooltip>
                  </i>

                  <div className="tag_title"> {item.tag}</div>
                </h4>
                {toggle && (
                  <span className="cheveron-icon flex alignCenter">
                    <Icon icon={arrowRight} />
                  </span>
                )}
              </div>
            </a>
          </Popover>
        ) : null}
      </SidebarListItemWrapper>
    );
  };

  return <>{renderSidebarWrapper()}</>;
};

const SingleRoute = ({ item, toggle }) => {
  const { can } = useRbac(item.permission ? item.permission : "");

  const renderRoute = () => (
    <Link
      className={"d-block tab"}
      to={item && item.route ? item.route : "app/dashboard"}
    >
      <div className={`flex alignCenter justifySpaceBetween`}>
        <h4 className="flex alignCenter list-title ">
          <i className="icon-styles mr-17 flex alginCenter">
            <Tooltip placement={toggle ? "top" : "right"} title={`${item.tag}`}>
              <Icon style={{ fontSize: 17 }} icon={item.icon} />
            </Tooltip>
          </i>
          <div className="tag_title">{item.tag}</div>
        </h4>
      </div>
    </Link>
  );
  if (!item.permission) {
    return renderRoute();
  } else if (item.permission && can()) {
    return renderRoute();
  } else {
    return null;
  }
};

const SidebarChildren = ({ child, index, routeHistory }) => {
  const renderListItem = () => {
    return (
      <li
        key={index}
        className={`child-list-item ${
          child.route === routeHistory.location.pathname && "active-item"
        } ${child.break && "bdr-bottom"}`}
      >
        <Link key={index} to={child.route}>
          {child.tag}
        </Link>
      </li>
    );
  };
  return renderListItem();
};

const SidebarListItemWrapper: any = styled.li`
  background: #ffffff;
  transition: 0.3s all ease-in-out;
  cursor: pointer;

  font-size: ${convertToRem(13)};
  background: ${(props: any) =>
    props.parentActive ? `#F9FCFF` : "transparent"};

  border-left: ${(props: any) =>
    props.parentActive
      ? `${convertToRem(2)} solid ${Color.$PRIMARY}`
      : `${convertToRem(2)} solid transparent`};
  transition: 0.3s all ease-in-out;

  .tab h4 {
    margin: ${convertToRem(2)} 0;
    padding: ${convertToRem(6)};
    color: ${(props: any) =>
      props.parentActive ? `${Color.$PRIMARY}` : Color.$SIDEBAR};
    padding-left: ${convertToRem(25)};
    transition: 0.3s all ease-in-out;
    font-style: normal;
    font-weight: normal;
    font-size: ${convertToRem(14)};
    line-height: 134%;

    /* or 21px */

    letter-spacing: 0.02em;
  }

  .cheveron-icon {
    color: ${Color.$SIDEBAR};
    visibility: hidden;
    transform: translateX(-10px);
    transition: 0.2s all ease-in;
  }

  &:hover {
    background: #f9fcff;
    .tab h4 {
      color: ${Color.$PRIMARY};
    }
    .cheveron-icon {
      color: ${Color.$SIDEBAR};
      visibility: visible;
      transform: translateX(0px);
    }
  }

  .tag_title {
    visibility: ${(props: any) => (props.toggle ? "visible" : "hidden")};
    white-space: nowrap;
    opacity: ${(props: any) => (props.toggle ? "1" : "0")};
    transition: 0.4s all ease-in-out;
  }
`;

const WrapperPopoverContent = styled.div`
  margin: ${convertToRem(-12)} ${convertToRem(-16)};
  ul {
    list-style: none;
    padding: 0;

    .active-item > a {
      color: ${Color.$PRIMARY} !important;
      background: #f7f7f7;
    }

    li {
      font-style: normal;
      font-weight: normal;
      font-size: ${convertToRem(13)};
      transition: 0.3s all ease-in-out;
      margin: ${convertToRem(2)} 0;
      a {
        min-width: ${convertToRem(168)};
        padding: 0.5625rem 1.8125rem 0.5625rem 1.8125rem;
        display: block;
        color: ${Color.$LIGHT_BLACK};
      }

      &:hover {
        background: #f7f7f7;
        a {
          color: #1e88e5;
        }
      }
    }
    .bdr-bottom {
      border-bottom: ${convertToRem(1)} solid #ededed;
    }
  }
  .cheveron-icon {
    color: ${Color.$SIDEBAR};
  }
`;
