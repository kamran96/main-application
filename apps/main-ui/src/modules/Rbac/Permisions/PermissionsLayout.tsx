import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

import {
  addRolePermissionAPI,
  getPermissionModulesAPI,
  getRbacListAPI,
  permissionsShowAPI,
} from '../../../api/rbac';
import { CommonLoader } from '../../../components/FallBackLoader';
import { BoldText } from '../../../components/Para/BoldText';
import { P } from '../../../components/Para/P';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useRbac } from '../../../components/Rbac/useRbac';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { ISupportedRoutes } from '../../../modal';

export const PermissionsLayout: FC = () => {
  const queryCache = useQueryClient();
  // const [modulesResult] = useState([]);
  const { routeHistory, refetchPermissions } = useGlobalContext();
  const { history } = routeHistory;

  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [permissionTable, setPermissionsTable] = useState([]);
  const { mutate: mutateAddRolePermission } = useMutation(addRolePermissionAPI);

  const { data: modulesResponse, isLoading: modulesFetching } = useQuery(
    ['permission_modules'],
    getPermissionModulesAPI
  );

  const { data: rolesListData, isLoading: rolesListLoading } = useQuery(
    [`rbac-list`],
    getRbacListAPI
  );

  const { rbac } = useRbac(null);

  useEffect(() => {
    if (history.location.search) {
      const module = history.location.search.split('?module=')[1];
      setSelectedPermission(module);
    }
  }, [history]);

  const {
    data: selectedPermissionData,
    isLoading: selectedPermissionFetching,
    isFetched: permissionsFetched,
  } = useQuery(
    [`permission-show?type=${selectedPermission}`, selectedPermission],
    permissionsShowAPI,
    {
      enabled: !!selectedPermission,
      keepPreviousData: true,
    }
  );

  const onUpdatePermission = async (
    permissionId,
    rolePermissionId,
    roleId,
    checked
  ) => {
    const payload = {
      roleId,
      permissionId,
      rolePermissionId,
      hasPermission: checked,
    };

    await mutateAddRolePermission(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries(`permission-show?type=${setPermissions}`);
        refetchPermissions();
      },
    });
  };

  const rolesList =
    (rolesListData && rolesListData.data && rolesListData.data.result) || [];

  useEffect(() => {
    if (
      selectedPermissionData &&
      selectedPermissionData.data &&
      selectedPermissionData.data.result &&
      rolesList.length
    ) {
      const { result } = selectedPermissionData.data;

      const newResult = result.map((item, index) => {
        const data = { ...item };

        const indexOfRolePermission = rolesList.findIndex(
          (i) => item.parentId === i.roleId
        );

        const parents = [];
        rolesList.forEach((role, index) => {
          if (index <= indexOfRolePermission) {
            parents.push(role.name);
          }
        });

        return { ...data, parents };
      });
      setPermissionsTable(newResult);
    }
  }, [selectedPermissionData, rolesList]);

  useEffect(() => {
    if (
      modulesResponse &&
      modulesResponse.data &&
      modulesResponse.data.result
    ) {
      const { result } = modulesResponse.data;
      setPermissions(result);
      if (!selectedPermission) {
        setSelectedPermission(result[0]);
      }
    }
  }, [modulesResponse]);

  return (
    <WrapperPermissionsLayout>
      <div className="accessors">
        <div className="grid_title">
          <P>Modules</P>
        </div>
        <div className="list_area">
          <ul>
            {permissions.map((module, index) => {
              return (
                <li
                  className={`${
                    module === selectedPermission ? 'active-module' : ''
                  }`}
                  onClick={() => {
                    setSelectedPermission(module);
                    history.push(
                      `/app${ISupportedRoutes.SETTINGS}${ISupportedRoutes.PERMISSIONS}?module=${module}`
                    );
                  }}
                >
                  {module}
                </li>
              );
            })}
          </ul>
          <div
            className={`flex alignCenter justifyCenter accessor-loader ${
              !modulesFetching ? 'hide-loader' : ''
            }`}
          >
            <CommonLoader />
          </div>
        </div>
      </div>
      <div className="permissions_table">
        <div className="content_area_grid">
          <div
            className={`flex alignCenter justifyCenter permissions-loader ${
              !selectedPermissionFetching && permissionsFetched
                ? 'hide-loader'
                : ''
            }`}
          >
            <CommonLoader />
          </div>
          <div>
            <table className="dynamic_table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>
                    Permissions
                  </th>
                  {rolesList.map((item, index) => {
                    return <th key={index}>{item.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {permissionTable.map((item, index) => {
                  const indexOfRolePermission = rolesList.findIndex(
                    (i) => i.roleId === item.roleId
                  );
                  return (
                    <tr key={index}>
                      <td>
                        <BoldText className="mb-6">{item.title}</BoldText>
                        <span>{item.description}</span>
                      </td>

                      {rolesList.map((role, roleIndex) => {
                        return (
                          <td key={roleIndex}>
                            <Checkbox
                              disabled={
                                !rbac.can(
                                  PERMISSIONS.RBAC_ROLE_PERMISSION_UPDATE
                                )
                              }
                              className={`${
                                roleIndex === indexOfRolePermission
                                  ? 'active'
                                  : 'fade'
                              }`}
                              onChange={(e) => {
                                const { checked } = e.target;
                                const parents = [];
                                rolesList.forEach((r, i) => {
                                  if (i < roleIndex) {
                                    parents.push(r.name);
                                  }
                                });

                                const allTableData = [...permissionTable];
                                allTableData[index] = {
                                  ...allTableData[index],
                                  roleId: role.roleId,
                                  parents,
                                };
                                setPermissionsTable(allTableData);
                                onUpdatePermission(
                                  item.permissionId,
                                  item.rolePermissionId,
                                  role.roleId,
                                  checked
                                );
                              }}
                              checked={
                                item.parents.includes(role.name) ||
                                role.roleId === item.roleId
                              }
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WrapperPermissionsLayout>
  );
};
const WrapperPermissionsLayout = styled.div`
  display: grid;
  grid-gap: 0px;
  padding: 0px;
  grid-template-areas: 'menu content content content content content content content content ';
  .accessors {
    grid-area: menu;
    border-right: 1px solid
      ${(props: IThemeProps) => props?.theme?.colors?.seprator};
    border-bottom-left-radius: 5px;
    position: relative;
    .list_area {
      min-height: calc(100vh - 283px);
      min-width: 200px;
      position: relative;
    }
    .accessor-loader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 1;
      transition: 0.3s all ease-in-out;
    }
    .grid_title {
      border-top-left-radius: 5px;
    }

    ul {
      padding: 0;
      list-style: none;
      li {
        padding: 11px 0 11px 20px;
        font-size: 15px;
        line-height: 18px;
        /* identical to box height */
        cursor: pointer;
        letter-spacing: 0.04em;
        text-transform: capitalize;

        color: #6e6e6d;
        transition: 0.3s all ease-in-out;
        cursor: pointer;
        &:hover {
          background: ${(props: IThemeProps) =>
            props?.theme?.theme === 'dark'
              ? props?.theme?.colors?.sidebarListActive
              : '#f4f4f4'};
          color: ${(props: IThemeProps) =>
            props?.theme?.theme === 'dark'
              ? props?.theme?.colors?.sidebarListActiveText
              : '#1890ff'};
        }
      }
      li.active-module {
        background: ${(props: IThemeProps) =>
          props?.theme?.theme === 'dark'
            ? props?.theme?.colors?.sidebarListActive
            : '#f4f4f4'} !important;
        color: ${(props: IThemeProps) =>
          props?.theme?.theme === 'dark'
            ? props?.theme?.colors?.sidebarListActiveText
            : '#1890ff'} !important;
      }
    }
  }
  .permissions_table {
    grid-area: content;
    border-bottom-right-radius: 5px;
    min-width: calc(100vw - 905px);
    .grid_title {
      border-top-right-radius: 5px;
    }
  }

  .grid_title {
    width: 100%;
    padding: 19px 0;
    padding-left: 20px;
    p {
      margin: 0;
      font-size: 15px;
      line-height: 15px;
      -webkit-letter-spacing: 0.04em;
      -moz-letter-spacing: 0.04em;
      -ms-letter-spacing: 0.04em;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      font-weight: 500;
    }
  }

  .content_area_grid {
    padding: 0;
    position: relative;
    min-height: calc(100vh - 283px);

    padding-left: 4px;
    position: relative;
    .permissions-loader {
      position: absolute;
      width: 100%;
      height: 100%;
      background: ${(props: IThemeProps) => props?.theme?.colors?.layoutBg};
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      opacity: 1;
      transition: 0.3s all ease-in-out;
    }

    .dynamic_table {
      width: 100%;

      thead tr th {
        padding: 16px 10px;
        text-align: left;
        text-transform: capitalize;
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
        /* identical to box height */

        letter-spacing: 0.04em;
        text-transform: capitalize;

        color: ${(props: IThemeProps) =>
          props?.theme?.theme === 'dark'
            ? props?.theme?.colors?.textTd
            : '#00000'};
      }
      tbody {
        background: ${(props: IThemeProps) => props?.theme?.colors?.td};
      }
      tbody tr td {
        padding: 16px 10px;
        text-align: left;
        border-bottom: 1px solid
          ${(props: IThemeProps) => props?.theme?.colors?.seprator};
        text-transform: capitalize;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0.04em;
        text-transform: capitalize;
        color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
      }
      tbody tr td:first-child {
        text-align: left;
        padding-left: 26px;
      }
    }
  }

  .fade .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #c6c6c6 !important;
    border-color: #b0b0b0 !important;
  }
  .hide-loader {
    /* transition: 0.5s all ease-in-out; */
    z-index: -1 !important;
    opacity: 0 !important;
  }
`;
