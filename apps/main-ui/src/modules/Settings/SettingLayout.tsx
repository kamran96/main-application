import React, { FC } from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import convertToRem from '../../utils/convertToRem';
import {
  ISettingRoutesSchema,
  settingRoutingScheam,
} from './utils/settingRoutingSchema';
import { Link } from 'react-router-dom';
import Icon from '@iconify/react';
import { ITheme, IThemeProps } from '@invyce/shared/invyce-theme';

export const SettingLayout: FC = (props: RouteConfigComponentProps) => {
  return (
    <WrapperSettingLayout>
      <Heading type="container">Setting</Heading>
      <section className="flex main-wrapper">
        <aside className="sidebar">
          <ul>
            {settingRoutingScheam.map(
              (route: ISettingRoutesSchema, index: number) => {
                let activeRoute =
                  props?.location?.pathname === route?.route ? 'active' : '';

                return (
                  <li>
                    <Link
                      className={`flex alignCenter ${activeRoute} `}
                      to={route?.route}
                    >
                      {' '}
                      <span className="flex alignCenter route-icon mr-10">
                        <Icon icon={route?.icon} />
                      </span>
                      {route?.tag}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </aside>
        <main className="container_render">
          {renderRoutes(props?.route?.routes)}
        </main>
      </section>
    </WrapperSettingLayout>
  );
};

const WrapperSettingLayout = styled.div`
  padding: 0 ${convertToRem(80)};

  .sidebar {
    min-width: 200px;
    max-width: 200px;
    padding-top: 61px;
    margin-right: 90px;
    ul {
      list-style: none;
      padding: 0;
      li {
        margin: 8px 0;
      }
      li a {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 21px;
        /* identical to box height */
        padding: 12px 15px;
        letter-spacing: 0.03em;
        text-transform: capitalize;

        color: #5f5f5f;
        transition: 0.4s all ease-in-out;
      }
      li:hover a {
        color: ${({ theme }: IThemeProps) =>
          theme?.theme === 'dark'
            ? theme?.colors?.sidebarListActiveText
            : '#090909'};
        background: ${({ theme }: IThemeProps) =>
          theme?.theme === 'dark' ? theme?.colors?.sidebarListActive : '#fff'};
      }
      li a.active {
        color: ${({ theme }: IThemeProps) =>
          theme?.theme === 'dark'
            ? theme?.colors?.sidebarListActiveText
            : '#090909'};
        background: ${({ theme }: IThemeProps) =>
          theme?.theme === 'dark' ? theme?.colors?.sidebarListActive : '#fff'};
      }
    }
  }

  .container_render {
    width: 100%;
  }
`;
