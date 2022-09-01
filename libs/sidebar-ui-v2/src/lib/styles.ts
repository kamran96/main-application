import { convertToRem } from '@invyce/pixels-to-rem';
import { IThemeProps } from '@invyce/shared/invyce-theme';
import { DivProps } from '@invyce/shared/types';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

interface ISidebarWrapperProps extends DivProps {
  toggle: boolean;
}

const subMenuOpen = keyframes`
  0% {
    transform: translateY(-200px);
    display: none;
    opacity: 0;
    visibility: hidden;
    height: 0px;
   
   
    padding: 0px 10px 0px 30px;
    /* padding: 0px;
    margin: 0px; */

  }
  30%{
    height: 100%;
  }
  50%{
    display: block;
    opacity: 0;

  }
  70%{
    visibility: visible;
  }
  100%{
    opacity: 1;
    transform: translateY(0);
    padding: 10px 10px 10px 30px;
  
      /* font-size: convertToRem(0.8); */  
  }
 
  `;
const subMenuClose = keyframes`
  0%{
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    height: auto;
    display: none;
    padding: 10px 10px 10px 30px;
  }
  /* 50%{
    opacity: 0;
    visibility: hidden;
  }
  70%{
    display: none;
  }
  100% {
    transform: translateY(-200px);
    display: none;
    opacity: 0;
    visibility: hidden;
    height: 0px;
    padding: 0px 10px 0px 25px;
  } */
  `;

export const SidebarWrapper = styled.aside<ISidebarWrapperProps>`
  position: relative;
  .toggle {
    position: absolute;
    z-index: 22;
    transition: 0.3s all ease-in-out;
    top: 14px;
    ${(props: ISidebarWrapperProps) =>
      !props?.toggle
        ? `
    left: 52px;
    `
        : `left: 160px;`}
    .collapse {
      border: 1px solid #fff;
      background: ${(props: IThemeProps) =>
        props?.theme?.theme === 'light' ? `#EFEFEF` : `#383838`};
      height: 26px;
      width: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #7d7d7d;
      position: relative;
      right: 0;
      transition: 0.3s all ease-in-out;
      box-shadow: 0px 0px 4px 0px transparent;
      ${(props: ISidebarWrapperProps) =>
        props?.toggle
          ? ` 
      left: 30px;

      transform: rotateY(180deg) `
          : ``};
      &:hover {
        box-shadow: 0px 0px 4px 0px #1e75f159;
      }
    }
  }
  .sidebar_wrapper {
    position: relative;
    height: calc(100vh - 0px);
    background: ${(props: IThemeProps) => props.theme.colors.sidebarBg};
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
  }
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
    flex-direction: 'row';
  }
  .logo_area span {
    margin-left: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? '23px' : '23px'};
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background: ${(props: IThemeProps) => props?.theme?.colors?.sidebarBg};
  }

  /* user info */
  .sidebar-userinfo {
    margin-left: ${(props: ISidebarWrapperProps) =>
      !props?.toggle ? '6px' : '23px'};
    .user_avatar {
      border: ${convertToRem(1.5)} solid #1565d8;
    }
    h4 {
      color: #7988ff;
    }
    h5 {
      color: #90a0b7;
    }
  }

  hr {
    border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.seprator};
  }
  .routes {
    height: calc(100vh - 226px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .route_list {
    list-style: none;
    padding: 0;

    .sub_route_parent {
      padding: 6px 6px 6px 24px;
      min-height: 34px;
      width: 100%;
      transition: 0.3s all ease-in-out;
      z-index: 4;
      position: relative;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
    }

    .submenu_container {
      font-size: 12px;
      line-height: 2.1;
      position: relative;

      ul {
        list-style-type: none;
        border-left: 1px solid #ebeff2;
        padding-left: 20px;

        li {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          transition: all 0.3s ease-in-out !important;
          border-radius: 5px;

          a {
            color: ${(props: IThemeProps) =>
              props?.theme?.theme === 'dark' ? '#fff' : '#334d6e'};
            padding: 4px 20px 4px 10px !important;
          }

          &:hover {
            background: ${(props: IThemeProps) =>
              props?.theme?.colors?.sidebarListActive};
            a {
              color: ${(props: IThemeProps) =>
                props?.theme?.colors?.sidebarListActiveText};
            }
          }
        }
      }
    }
    .open-anchor {
      animation-name: ${subMenuOpen};
      animation-duration: 0.5s;
      animation-iteration-count: ease-in-out;
      margin-top: -10px;
      transition: 0.6s all ease-in-out;
      padding: 10px 10px 10px 30px;
      z-index: 1;
    }
    .close-anchor {
      animation-name: ${subMenuClose};
      animation-duration: 0.34s;
      animation-iteration-count: linear;
      margin-top: -10px;
      transition: 0.34s all ease-in-out;
      padding: 0px 10px 0px 30px;
      height: 0px;
      visibility: hidden;
      opacity: 0;
      z-index: 1;
    }

    .route_list_item_parent {
      padding: 6px 24px;
      min-height: 34px;
      width: 100%;
      transition: 0.3s all ease-in-out;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};

      span svg {
        fill: none;
        stroke: ${(props: IThemeProps) =>
          props?.theme?.theme === 'dark' ? '#fff' : '#272525'};
      }

      &:hover {
        background: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActive};
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
        transition: 0.3s all ease-in-out;

        span svg {
          fill: none;
          stroke: ${(props: IThemeProps) =>
            props?.theme?.theme === 'dark' ? '#fff' : '#7988FF'};
          /* stroke-width: 1.8px; */
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
        .ThreeIconsDiff {
          fill: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarDefaultText};
        }

        span svg {
          fill: none;
          stroke: ${(props: IThemeProps) =>
            props?.theme?.theme === 'dark' ? '#fff' : '#272525'};
          /* stroke-width: 1.8px; */
        }

        &:hover {
          background: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActive};
          color: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActiveText};
          transition: 0.3s all ease-in-out;

          span svg {
            fill: none;
            stroke: ${(props: IThemeProps) =>
              props?.theme?.theme === 'dark' ? '#fff' : '#7988FF'};
            /* stroke-width: 1.8px; */
          }
        }
      }
    }
    .active_route {
      background: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActive};

      a {
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActiveText};
        span svg {
          fill: none;
          stroke: ${(props: IThemeProps) =>
            props?.theme?.theme === 'dark' ? '#fff' : '#7988FF'};
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
    padding: 4px 24px;
    min-height: 32px;
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
