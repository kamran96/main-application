import { convertToRem } from '@invyce/pixels-to-rem';
import { IThemeProps } from '@invyce/shared/invyce-theme';
import { DivProps } from '@invyce/shared/types';
import styled, { createGlobalStyle } from 'styled-components';

interface ISidebarWrapperProps extends DivProps {
  toggle: boolean;
}

export const SidebarWrapper = styled.aside<ISidebarWrapperProps>`
  position: relative;
  height: calc(100vh - 0px);
  background: ${(props: IThemeProps) => props.theme.colors.sidebarBg};
  /* max-width:  */
  padding-top: ${convertToRem(10)};
  padding-bottom: ${convertToRem(10)};
  z-index: 1;
  transition: 0.3s all ease-in-out;
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
    transition: 0.3s all ease-in-out;

    visibility: ${(props: IThemeProps) =>
      props?.toggle ? 'visible' : 'hidden'};
    opacity: ${(props: IThemeProps) => (props?.toggle ? 1 : 0)};
    white-space: nowrap;
    opacity: ${(props: IThemeProps) => (props?.toggle ? '1' : '0')};
    left: ${(props: IThemeProps) => (props?.toggle ? '0' : convertToRem(-200))};
    transition: 0.3s all ease-in-out;
  }

  .logo_area {
    flex-direction: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? 'column' : 'row'};
  }
  .logo_area span {
    margin-left: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? '0' : '21px'};
  }

  .collapse {
    background: ${(props: IThemeProps) =>
      props?.theme?.theme === 'light' ? `#f6f8fa` : `#383838`};
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    color: #7d7d7d;
    position: relative;
    transition: 0.3s all ease-in-out;
    box-shadow: 0px 0px 4px 0px transparent;
    ${(props: ISidebarWrapperProps) =>
      props?.toggle
        ? ` 
      left: 20px;
      transform: rotateY(180deg) `
        : ``};
    &:hover {
      box-shadow: 0px 0px 4px 0px #1e75f159;
    }
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

  .routes {
    height: calc(100vh - 214px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .route_list {
    list-style: none;
    padding: 0;

    .route_list_item_parent {
      padding: 6px 24px;
      min-height: 34px;
      width: 100%;
      transition: 0.3s all ease-in-out;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};

      span svg path {
        stroke: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarDefaultText};
      }

      &:hover {
        background: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActive};
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};

        span svg {
          fill: #ffffff;
          stroke: none;
          transition: 0.3s all ease-in-out;

          path {
            stroke: #ffffff;
            transition: 0.3s all ease-in-out;
          }
          .BlackSpace {
            stroke: #272525;
          }
          .fillTransparent {
            fill: transparent;
          }
          .BlackFill {
            fill: #272525 !important;
          }
          .ReportColor {
            stroke: ${(props: IThemeProps) =>
              props?.theme?.colors?.sidebarListActiveText};
          }
        }
      }
    }
    .route_list_item {
      a {
        padding: 6px 24px;
        min-height: 34px;
        width: 100%;
        transition: 0.3s all ease-in-out;
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarDefaultText};

        span svg {
          path {
            stroke: ${(props: IThemeProps) =>
              props?.theme?.colors?.sidebarDefaultText};
          }

          .ItemsIconsColor {
            fill: ${(props: IThemeProps) =>
              props?.theme?.theme === 'dark' ? 'transparent' : 'transparent'};
          }

          .itemStroke {
            stroke: none;
          }

          .ItemsFill {
            fill: ${(props: IThemeProps) =>
              props?.theme?.theme === 'dark' ? '#C2C2C2' : ''};
          }
        }

        &:hover {
          background: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActive};
          color: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActiveText};

          span svg {
            fill: #ffffff;
            transition: 0.3s all ease-in-out;

            path {
              stroke: #ffffff;
              transition: 0.3s all ease-in-out;
            }
            .BlackSpace {
              stroke: #272525 !important;
            }
            .BlackFill {
              fill: #272525 !important;
            }
            .itemStroke {
              stroke: none;
            }

            .fillTransparent {
              fill: transparent !important;
            }

            .fillItemColor {
              fill: #ffffff !important;
            }
          }
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

      span svg {
        fill: #ffffff;
        transition: 0.3s all ease-in-out;

        path {
          stroke: #ffffff !important;
          transition: 0.3s all ease-in-out;
        }
        .BlackSpace {
          stroke: #272525 !important;
          transition: 0.3s all ease-in-out;
        }
        .BlackFill {
          fill: #272525 !important;
        }
        .itemStroke {
          stroke: none;
          transition: 0.3s all ease-in-out;
        }

        .fillTransparent {
          fill: transparent;
        }

        .fillItemColor {
          fill: #ffffff !important;
          transition: 0.3s all ease-in-out;
        }
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
    transition: 0.3s all ease-in-out;
  }
  .quickaccess_routes {
    .route_list {
      transition: 0.52s all ease-in-out;
      position: relative;
      top: ${(props: ISidebarWrapperProps) =>
        props?.toggle ? '0px' : '-43px'};
    }
  }

  .sidebar_bottom {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .sidebar_bottom .route_list_item {
    padding: 6px 24px;

    min-height: 34px;
    max-width: 100%;
    transition: 0.3s all ease-in-out;
    color: ${(props: IThemeProps) => props?.theme?.colors?.sidebarDefaultText};
  }

  .sidebar_bottom .theme_changer {
    ${(props: ISidebarWrapperProps) =>
      !props?.toggle
        ? `
        padding-left: 17px !important;
    `
        : `
        
        `}
  }

  .sidebar_bottom .theme_button {
    display: flex;
    align-items: center;
    border-radius: 50px;
    ${(props: ISidebarWrapperProps) =>
      !props?.toggle
        ? `
        width: 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        span{
          margin: 0 !important
        }
    `
        : `
        
        `}

    .title {
      ${(props: ISidebarWrapperProps) =>
        props?.toggle
          ? `
      display: block;
      
      `
          : `
          display: none
      `}
    }
  }

  hr {
    border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.seprator};
  }

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
      transition: 0.3s all ease-in-out;
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

.open_popover{
  z-index: 1111 !important;
  width: 199px !important;
  
}

`;
