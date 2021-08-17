import React, { FC, useState } from "react";
import styled from "styled-components";
import { Color, NOTIFICATIONTYPE } from "../../../modal";
import { Icon } from "@iconify/react";
import addAlt from "@iconify/icons-carbon/add-alt";
import arrowDown from "@iconify-icons/fe/arrow-down";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import convertToRem from "../../../utils/convertToRem";
import { Link } from "react-router-dom";
import { ISupportedRoutes } from "../../../modal/routing";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { OrganizationMenu } from "./OrganizationMenu";
import Clickoutside from "../../Clickoutside";
import { getOrganizations } from "../../../api/organizations";
import { queryCache, useMutation, useQuery } from "react-query";
import { IOrganizations, IOrganizationType } from "../../../modal/organization";
import { P } from "../../Typography";
import { activeBranchAPI, updateThemeAPI } from "../../../api";
import checkIcon from "@iconify-icons/fe/check";
import { Rbac } from "../../Rbac";
import { PERMISSIONS } from "../../Rbac/permissions";
import { Switch } from "antd";
import { IThemeProps } from "../../../hooks/useTheme/themeColors";
import { ILoginActions } from "../../../hooks/globalContext/globalManager";

export const UserAccountArea: FC = () => {
  const [mutateActiveBranch] = useMutation(activeBranchAPI);
  const { notificationCallback, isOnline } = useGlobalContext();
  const [muateTheme, resMutateTheme] = useMutation(updateThemeAPI);
  const [branchMenu, setBranchMenu] = useState(false);
  const {
    userDetails,
    handleLogin,
    setOrganizationConfig,
    setBranchModalConfig,
    setTheme,
    theme,
  } = useGlobalContext();

  const profile = userDetails && userDetails.profile;
  const { organizationId, organization } = userDetails;

  const { branchId } = userDetails;

  const attachment = profile && profile.attachment;

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    handleLogin({ type: ILoginActions.LOGOUT });
  };

  const { data } = useQuery([`all-organizations`], getOrganizations, {
    cacheTime: Infinity,
  });

  const organizations: IOrganizations[] =
    (data && data.data && data.data.result) || [];

  const getActiveOrganization = (id) => {
    const [filtered] =
      organizations && organizations.filter((item) => item.id === id);

    return filtered;
  };

  const getActiveBranch = (id: Number | string) => {
    const activeOrgBranches =
      getActiveOrganization(organizationId)?.branches;
    if (activeOrgBranches?.length > 0) {
      const [filtered] = activeOrgBranches.filter((item) => item.id === id);
      return filtered;
    }else{
      return null
    }
  };

  const handleActiveBranch = async (
    branchId: number,
    organizationId: number
  ) => {
    const UserId: number = userDetails.id;
    let payload: any = {
      branchId,
      organizationId,
      UserId,
    };

    try {
      await mutateActiveBranch(payload, {
        onSuccess: () => {
          notificationCallback(NOTIFICATIONTYPE.SUCCESS, "Branch Updated");
          queryCache.clear();

          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
      });
    } catch (error) {}
  };

  const handleThemeSwitch = async (theme) => {
    setTheme(theme);
    const payload = {
      theme,
    };
    await muateTheme(payload);
  };

  const activeBranch = organizationId && branchId && getActiveBranch(branchId);



  return (
    <WrapperUserAccountArea>
      <Clickoutside onClickOutSide={() => setBranchMenu(false)}>
        {organizationId && getActiveOrganization(organizationId) && branchId && organization?.organizationType!==IOrganizationType.SAAS && (
          <BranchesMenu
            onClick={() => setBranchMenu(!branchMenu)}
            isOpen={branchMenu}
          >
            <div className="active_store">
              <div className="branch_wrapper flex alignCenter justifySpaceBetween">
                <P className="flex alignCenter justifySpaceBetween">
                  {activeBranch ? <>{activeBranch.name}</> : ""}
                </P>
                <i className="branch_cheveron_icon flex alignCenter ml-5">
                  <Rbac permission={PERMISSIONS.BRANCHES_CREATE}>
                    <Icon icon={arrowDown} />
                  </Rbac>
                </i>
              </div>
            </div>
            <Rbac permission={PERMISSIONS.BRANCHES_CREATE}>
              <ul className="branches_list">
                {organizationId &&
                  getActiveOrganization(organizationId) &&
                  getActiveOrganization(organizationId).branches.map(
                    (branch, index) => {
                      return (
                        <li
                          onClick={() => {
                            handleActiveBranch(
                              branch.id,
                              branch.organizationId
                            );
                          }}
                          className={`${
                            branch.id === branchId
                              ? "active-branch flex alignItems justifySpaceBetween"
                              : ""
                          }`}
                          key={index}
                        >
                          {branch.name}
                          <i className="_branch_active_icon">
                            {branch.id === branchId && (
                              <Icon icon={checkIcon} />
                            )}
                          </i>
                        </li>
                      );
                    }
                  )}
                <li
                  onClick={() => {
                    setBranchModalConfig(true, organizationId);
                  }}
                  className="flex alignCenter justifyCenter"
                >
                  <Button type="link" size="small">
                    Add Store
                  </Button>
                </li>
              </ul>
            </Rbac>
          </BranchesMenu>
        )}
      </Clickoutside>
      <Clickoutside onClickOutSide={() => setDropdownVisible(false)}>
        <div
          onClick={() => setDropdownVisible(true)}
          className="userDropdown flex alignCenter pointer"
        >
          <div className="user_profile">
            {attachment && attachment.path ? (
              <Avatar size={28} src={attachment.path} />
            ) : (
              <Avatar size={28} icon={<UserOutlined size={28} />} />
            )}
          </div>
          <P
            style={{ lineHeight: "1" }}
            className="ml-5 flex alignCenter justifySpaceBetween login_user_details"
          >
            <div>
              {userDetails &&
              userDetails.profile &&
              userDetails.profile.fullName
                ? userDetails.profile.fullName
                : userDetails.name}
              <br />
              <span className={` online-check`}>
                <div className={`dot ${isOnline ? "online" : "offline"}`}></div>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <i className="branch_cheveron_icon flex alignCenter ml-10">
              <Icon icon={arrowDown} />
            </i>
          </P>
        </div>
        <ListWrapper isVisible={dropdownVisible}>
          <ul className="list_wrapper">
            <Link to={`/app${ISupportedRoutes.SETTINGS}${ISupportedRoutes.PROFILE_SETTING}`}>
              <li>Edit Profile</li>
            </Link>
            <hr className="seprator" />
            <Link to={`/app${ISupportedRoutes.SETTINGS}${ISupportedRoutes.ACCOUNT_SETTING}`}>
              <li>Edit Account</li>
            </Link>
            <li onClick={handleLogout}>Logout</li>
            <hr className="seprator" />
            {/* <div className="org_list_wrapper">
              {organizations.map((org, index) => {
                return (
                  <OrganizationMenu key={index} organizationDetails={org} />
                );
              })}
            </div> */}
            {/* <Rbac permission={PERMISSIONS.ORGANIZATIONS_CREATE}>
              <ListOrganizations onClick={() => setOrganizationConfig(true)}>
                <i className="add_organization">
                  <Icon className="add_org_icon" icon={addAlt} />
                  Add Organization
                </i>
              </ListOrganizations>
            </Rbac> */}
            <hr className="seprator" />
            <ListOrganizations>Files</ListOrganizations>
            <Link to={`/app${ISupportedRoutes.SETTINGS}`}>
              <li>Setting</li>
            </Link>
            <ListOrganizations>Subscriptions and Bills</ListOrganizations>
            <hr className="seprator" />
            <ListOrganizations>Phunar App Store</ListOrganizations>
            <ListOrganizations className="flex alignCenter justifySpaceBetween">
              Dark Mode
              <Switch
                className="mr-10"
                checked={theme === "dark" ? true : false}
                onChange={(checked) =>
                  handleThemeSwitch(checked ? "dark" : "light")
                }
              />
            </ListOrganizations>
          </ul>
        </ListWrapper>
      </Clickoutside>
    </WrapperUserAccountArea>
  );
};

const WrapperUserAccountArea = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .add_organization {
    display: flex;
    align-items: center;
    color: ${Color.$PRIMARY};
    font-style: unset;
    .add_org_icon {
      font-size: ${convertToRem(16)};
      margin-right: ${convertToRem(8)};
    }
  }

  .bell_icon {
    height: ${convertToRem(18)};
    width: ${convertToRem(18)};
    color: #ffff;
    margin-right: ${convertToRem(26)};
  }

  .search_icon {
    width: ${convertToRem(18)};
    height: ${convertToRem(18)};
    margin-right: ${convertToRem(26)};
    color: #ffff;
  }

  .online-check {
    font-size: 10px;
    position: relative;
    position: relative;
    display: flex;
    align-items: center;

    .dot {
      height: 8px;
      width: 8px;
      border-radius: 25px;
      margin-right: 4px;
    }
    .dot.offline {
      background: #ff9b20;
    }
    .dot.online {
      background: #009a1a;
    }
  }
`;

const ListOrganizations = styled.li`
  display: flex;
  align-items: center;
  .ant-avatar {
    margin-right: ${convertToRem(8)};
  }
`;

const ListWrapper: any = styled.div`
  padding: ${convertToRem(6)} 0;
  position: fixed;
  top: ${convertToRem(42)};
  background: ${(props: IThemeProps) =>
    props?.theme?.theme === "dark"
      ? props?.theme?.colors?.topbar
      : props?.theme?.colors.$WHITE};
  border: ${convertToRem(1)} solid transparent;
  box-sizing: border-box;
  box-shadow: ${convertToRem(0)} ${convertToRem(2)} ${convertToRem(6)}
    rgba(0, 0, 0, 0.13);
  border-radius: ${convertToRem(3)};
  width: ${convertToRem(233)};
  transition: 0.3s all ease-in-out;
  right: ${(props: any) => (props.isVisible ? `${convertToRem(3)}` : "-600px")};
  .list_wrapper {
    list-style: none;
    margin: 0;
    padding: 0;
    a {
      cursor: pointer;
      color: #3e3e3c;
    }
    li {
      font-style: normal;
      font-size: ${convertToRem(14)};
      line-height: ${convertToRem(16)};
      letter-spacing: 0.04em;
      padding: ${convertToRem(10)} ${convertToRem(16)};
      transition: 0.3s all ease-in-out;
      font-weight: 400;
      cursor: pointer;
      color: ${(props: IThemeProps) => props.theme.colors.sidebarDefaultText};
      text-transform: capitalize;
      &:hover {
        background-color: ${(props: IThemeProps) =>
          props.theme.colors.sidebarListActive};
        color: ${(props: IThemeProps) =>
          props.theme.colors.sidebarListActiveText};
      }
    }
    .seprator {
      height: 1px;
      background: ${(props: IThemeProps) => props.theme.colors.seprator};
      border: none;
      margin: 0;
    }
  }
  .org_list_wrapper {
    max-height: 163px;
    overflow-y: auto;
    background: white;
  }
`;

const BranchesMenu = styled.div`
  margin-right: 20px;
  position: relative;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  .login_user_details {
    span {
      font-size: 10px;
    }
  }
  ._branch_active_icon {
    display: flex;
    align-items: center;
  }
  .active_store {
    padding: 12px;
    background: #ffffff17;
    min-width: 138px;
    width: max-content;
  }

  .branches_list {
    position: absolute;
    min-width: 175px;
    width: 100%;
    background: ${(props: IThemeProps) => props?.theme?.colors?.$WHITE};
    list-style: none;
    left: 0;
    top: 40px;
    height: ${(props: any) => (props.isOpen ? "auto" : 0)};
    padding: 0;
    overflow: hidden;
    transition: 1s all ease-in-out;
    box-shadow: ${convertToRem(0)} ${convertToRem(2)} ${convertToRem(6)}
      rgba(0, 0, 0, 0.13);

    li:first-child {
      margin-top: 5px;
    }
    li:last-child {
      margin-bottom: 5px;
    }
    li {
      padding: 7px 9px;
      background-color: transparent;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
      transition: 0.4s all ease-in-out;
      display: flex;
      align-items: center;
      margin: 2px;
      font-size: 0.875rem;
      ._branch_active_icon {
        padding: 0 3px;
        display: flex;
        align-items: center;
      }
      &:hover {
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
        background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
      }
    }
    li.active-branch {
      background: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActive};
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActiveText};
    }
  }

  .branch_cheveron_icon {
    color: ${Color.$WHITE};
  }
  /* &:hover {
    transition: 0.3s all ease-in-out;
    .branches_list {
      height: max-content;
    }
  } */
`;
