import React, { FC } from 'react';
import { Avatar, Menu, Tooltip } from 'antd';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import plusOutlined from '@iconify-icons/ant-design/plus-outlined';
import { Color, NOTIFICATIONTYPE } from '../../../modal';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IBranch, IOrganizations } from '../../../modal/organization';
import { useQueryClient, useMutation } from 'react-query';
import { activeBranchAPI } from '../../../api';
import { Rbac } from '../../Rbac';
import { PERMISSIONS } from '../../Rbac/permissions';
import { useRbac } from '../../Rbac/useRbac';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';

const { SubMenu } = Menu;

interface IProps {
  organizationDetails?: IOrganizations;
}

export const OrganizationMenu: FC<IProps> = ({ organizationDetails }) => {
  const queryCache = useQueryClient();
  const { setBranchModalConfig, userDetails, notificationCallback } =
    useGlobalContext();
  const activeOrganization = userDetails.organizationId;
  const activeBranch = userDetails.branchId;

  const { rbac } = useRbac(null);

  /* Mutations  */
  const { mutate: mutateActiveBranch } = useMutation(activeBranchAPI);

  const renderOrganizationIcon = (name) => {
    let icon = '';
    const splitArr = name.split('');
    icon = `${splitArr[0]}${splitArr[1]}`;

    return icon;
  };

  const handleActiveBranch = async (
    branchId: number,
    organizationId: number
  ) => {
    const UserId: number = userDetails.id;
    const payload: any = {
      branchId,
      organizationId,
      UserId,
    };

    await mutateActiveBranch(payload, {
      onSuccess: () => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Branch Updated');
        queryCache.clear();

        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const isActiveClass = `${
    organizationDetails.id === activeOrganization && 'active-organization'
  }`;

  return (
    <WrapperOrganizationMenu>
      <Menu className={isActiveClass} style={{ width: '100%' }} mode="inline">
        <SubMenu
          key="sub1"
          title={
            <span>
              <Avatar
                style={{ background: `#E1AE4A` }}
                size={24}
                shape="square"
              >
                {renderOrganizationIcon(`${organizationDetails.name}`)}
              </Avatar>
              <span className="ml-10">{organizationDetails.name}</span>
            </span>
          }
        >
          <Rbac permission={PERMISSIONS.BRANCHES_CREATE}>
            <Menu.Item
              onClick={() => setBranchModalConfig(true, organizationDetails.id)}
              key="add-store"
              className="pointer"
            >
              <div className="flex alignCenter clr-primary ">
                <i className="mr-10 flex alignCenter">
                  <Icon icon={plusOutlined} />
                </i>
                Add New Store
              </div>
            </Menu.Item>
          </Rbac>
          {organizationDetails.branches.length &&
            organizationDetails.branches.map((branch: IBranch, index) => {
              if (rbac.can(PERMISSIONS.ORGANIZATIONS_INDEX)) {
                return (
                  <Menu.Item
                    onClick={() => {
                      if (rbac.can(PERMISSIONS.BRANCHES_CREATE)) {
                        handleActiveBranch(branch.id, branch.organizationId);
                      }
                    }}
                    key={branch.id}
                    className="list-item-organizations"
                  >
                    <Tooltip placement="top" title={`${branch.name}`}>
                      <span className="branch-name">{branch.name}</span>
                    </Tooltip>
                    <div
                      className={`circle ${
                        activeBranch === branch.id && `active`
                      }`}
                    ></div>
                  </Menu.Item>
                );
              } else {
                if (branch.name === userDetails?.branch?.name) {
                  return (
                    <Menu.Item
                      onClick={() => {
                        if (rbac.can(PERMISSIONS.BRANCHES_CREATE)) {
                          handleActiveBranch(branch.id, branch.organizationId);
                        }
                      }}
                      key={branch.id}
                      className="list-item-organizations"
                    >
                      <Tooltip placement="top" title={`${branch.name}`}>
                        <span className="branch-name">{branch.name}</span>
                      </Tooltip>
                      <div
                        className={`circle ${
                          activeBranch === branch.id && `active`
                        }`}
                      ></div>
                    </Menu.Item>
                  );
                } else {
                  return null;
                }
              }
            })}
          {/* <Menu.Item key="2">Option 2</Menu.Item> */}
        </SubMenu>
      </Menu>
    </WrapperOrganizationMenu>
  );
};

const WrapperOrganizationMenu: any = styled.div`
  .ant-menu {
    background: ${(props: IThemeProps) => props.theme.colors.$WHITE};
    .ant-menu-submenu {
      padding: 0;

      .ant-menu-submenu-title {
        padding: 0 19px;
        margin: 0;
      }
      .ant-menu-item {
        padding-left: 26px !important;
        margin: 0;
        padding: 0;
      }
    }

    .ant-menu-item-selected {
      background-color: unset;
    }
  }

  .list-item-organizations {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 17px !important;

    .branch-name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .circle {
      position: relative;
      height: 16px;
      width: 16px;
      min-width: 16px;
      background-color: #ff000000;
      border-radius: 50%;
      border: 1.6px solid #b9b9b9;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        position: absolute;
        content: '';

        width: 8px;
        height: 8px;

        border-radius: 50%;
      }
    }

    .active::after {
      background-color: ${Color.$PRIMARY};
    }
  }

  .active-organization {
    .ant-menu-submenu-title {
      background-color: #f0f0f0;
      border-left: 5px solid ${Color.$PRIMARY};
      color: ${Color.$PRIMARY};
    }
  }
`;
