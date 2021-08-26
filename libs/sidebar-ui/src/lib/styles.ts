import styled, { createGlobalStyle } from 'styled-components';
import { convertToRem } from '@invyce/pixels-to-rem';
import { IThemeProps } from '@invyce/shared/invyce-theme';
import { DivProps } from '@invyce/shared/types';

interface ISidebarWrapperProps extends DivProps {
  toggle: boolean;
}

export const SidebarWrapper = styled.aside<ISidebarWrapperProps>`
  top: ${convertToRem(39)};
  height: calc(100vh - 28px);
  background: ${(props: IThemeProps) => props.theme.colors.sidebarBg};
  /* max-width:  */
  padding-top: ${convertToRem(10)};
  padding-bottom: ${convertToRem(52)};
  z-index: 1;
  transition: 0.4s all ease-in-out;
  left: 0;
  width: ${(props: IThemeProps) =>
    props?.toggle ? convertToRem(206) : convertToRem(65)};
  flex: 0 0
    ${(props: IThemeProps) =>
      props?.toggle ? convertToRem(206) : convertToRem(60)};
  overflow-x: hidden;
  overflow-y: auto;
  .head {
    position: relative;
    padding: 0.5rem 0.5rem 0.5rem 1.5625rem;
    transition: 0.4s all ease-in-out;

    visibility: ${(props: IThemeProps) =>
      props?.toggle ? 'visible' : 'hidden'};
    opacity: ${(props: IThemeProps) =>
      props?.toggle ? 1 : 0};
    white-space: nowrap;
    opacity: ${(props: IThemeProps) => (props?.toggle ? '1' : '0')};
    left: ${(props: IThemeProps) => (props?.toggle ? '0' : convertToRem(-200))};
    transition: 0.4s all ease-in-out;
  }

  .logo_area {
    flex-direction: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? 'column-reverse' : 'row'};
  }
  .logo_area span {
    margin-left: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? '0' : '21px'};
  }

  .collapse {
    color: #7d7d7d;
    position: relative;
    transition: 0.5s all ease-in-out;
    ${(props: ISidebarWrapperProps) =>
      props?.toggle
      ? ` 
      left: 20px;
      transform: rotateY(180deg) `
        : ``}
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
  }

  /* user info */
  .sidebar-userinfo {
    .user_avatar {
      border: ${convertToRem(2)} solid #1565d8;
    }
    h4 {
      color: #1e75f1;
    }
    h6 {
      color: #90a0b7;
    }
  }

  /* Main Routes Settings */

  .route_list {
    list-style: none;
    padding: 0;

    .route_list_item_parent {
      padding: 6px 24px;
      min-height: 34px;
      width: 100%;
      transition: 0.4s all ease-in-out;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
      &:hover {
        background: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActive};
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
      }
    }
    .route_list_item {
      a {
        padding: 6px 24px;
        min-height: 34px;
        width: 100%;
        transition: 0.4s all ease-in-out;
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarDefaultText};

        &:hover {
          background: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActive};
          color: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActiveText};
        }
      }
    }
    .active_route {
      background: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActive};
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActiveText};
      a {
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
      }
    }
  }

  .route_tag {
    white-space: nowrap;
    text-overflow: ellipsis;
    visibility: ${(props: ISidebarWrapperProps) =>
      props?.toggle ? 'visible' : 'hidden'};
  }

  .head {
    position: relative;
    padding: 0.5rem 0.5rem 0.5rem 1.5625rem;
    visibility: ${(props: IThemeProps) =>
      props?.toggle ? 'visible' : 'hidden'};
    white-space: nowrap;
    opacity: ${(props: IThemeProps) => (props?.toggle ? '1' : '0')};
    left: ${(props: IThemeProps) => (props?.toggle ? '0' : convertToRem(-200))};
    transition: 0.4s all ease-in-out;
  }
  .quickaccess_routes {
    .route_list {
      transition: 0.52s all ease-in-out;
      position: relative;
      top: ${(props: ISidebarWrapperProps) =>
        props?.toggle ? '0px' : '-43px'};
    }
  }

  hr{
    border-color: ${(props: IThemeProps)=> props?.theme?.colors?.seprator}
  }
`;

export const PopOverListWrapper = styled.ul`
  list-style: none;
  padding: 0;

  li {
    a {
      display: block;
      padding: 6px 24px;
      min-height: 34px;
      width: 100%;
      transition: 0.4s all ease-in-out;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};

      &:hover {
        background: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActive};
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
      }
    }
  }

  .active_child a {
    background: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActive};
    color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActiveText};
  }
`;

export const PopupGlobalStyles = createGlobalStyle`
.ant-popover-inner-content{
  padding: 0 !important;

}

`;
