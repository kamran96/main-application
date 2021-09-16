import { IThemeProps } from './../hooks/useTheme/themeColors';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
body{
    background-color: ${(props: IThemeProps) => props.theme.colors.layoutBg};
    overflow: hidden !important;
    .ant-card, .ant-popover-inner{
  background: ${(props: IThemeProps) =>
    props?.theme?.colors?.sidebarBg} !important;
}
}

.ant-input, .ant-input-number, .ant-select:not(.ant-select-customize-input) .ant-select-selector{
  box-shadow: none;
       ${(props: IThemeProps) =>
         props?.theme?.theme === 'dark'
           ? `
        background-color: ${(props: IThemeProps) =>
          props?.theme?.colors?.inputColorBg} !important;
        border: 1px solid ${(props: IThemeProps) =>
          props.theme.colors.seprator};
        color: ${(props: IThemeProps) =>
          props?.theme?.colors?.inputColor} !important;

       `
           : ``}
    
    }

  

    .ant-picker-cell-disabled::before{
      background: ${(props: IThemeProps) => props?.theme?.colors?.disabled}
    }

    .ant-picker-panel-container{
          background-color: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarBg} !important;

    }

    .customized-dropdown .ant-picker-footer {
  margin-right: 5px;
  border-right: 1px solid ${(props: IThemeProps) =>
    props?.theme?.colors?.seprator};
}

.ant-picker-header{
  border-bottom: 1px solid ${(props: IThemeProps) =>
    props?.theme?.colors?.seprator};
  color: ${(props: IThemeProps) => props?.theme?.colors?.textTd}
}


.ant-picker-cell{
  color: ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? 'rgb(154 154 154 / 25%)  '
      : 'rgba(0, 0, 0, 0.25)'}
}
.ant-picker-panel{
  border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.seprator}
}
.ant-picker-cell-in-view, .ant-picker-content th, .ant-picker-header button{
  color: ${(props: IThemeProps) => props?.theme?.colors?.textTd}
}


    .anticon{
        color: ${(props: IThemeProps) => props?.theme?.colors?.antIcon};
    }

    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: ${(props: IThemeProps) =>
    props?.theme?.colors?.placeHolder} !important;
}

.ant-drawer-content, .ant-drawer-header{
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarBg} !important;
}

.ant-drawer-title, .ant-radio-wrapper, .ant-checkbox-wrapper{
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd} !important;

}

.ant-tabs-tab.ant-tabs-tab-disabled{
    color: ${(props: IThemeProps) => props?.theme?.colors?.disabled}
}

.ant-drawer-mask, .ant-modal-mask{
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.modalOverlay} 
}

.ant-table table{
    height: 100%;
}
/* Antd tabs */

.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab{
  background: ${(props: IThemeProps) => props?.theme?.colors?.tabsBg};
  border: none;
}

.ant-pagination-item, .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link{
  background: ${(props: IThemeProps) => props?.theme?.colors?.paginationBg};
  /* border: none; */
  a, span{
    color: ${(props: IThemeProps) => props?.theme?.colors?.paginationColor};

  }
}




/* Button Disable */

.ant-btn[disabled], .ant-btn[disabled]:hover, .ant-btn[disabled]:focus, .ant-btn[disabled]:active{
  color: ${({ theme }: IThemeProps) => theme?.colors?.buttonDisabledText};
    background: ${({ theme }: IThemeProps) => theme?.colors?.buttonDisabledBg};
    
    text-shadow: none;
    box-shadow: none;

    ${(props: IThemeProps) =>
      props?.theme?.theme === 'dark' &&
      `
    border-color: ${props?.theme?.colors?.seprator}
    `}
}


/* sidebar */

.popup-sidebar-child{
  .ant-menu{
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarBg};

      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};
    .ant-menu-item,  .ant-menu-item a{
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarDefaultText};

      .ant-menu-submenu-title:hover{
    color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActiveText} !important;

      }
    }

    .ant-menu-submenu::hover, .ant-menu-item:hover{
    color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActiveText} !important;
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActive} !important;
a, .ant-menu-submenu-title{
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActiveText} !important;

}
    }

    
  }
  .ant-menu-submenu-active{
    background-color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActive} !important;
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActiveText} !important;

.ant-menu-submenu-title, .ant-menu-submenu-title .ant-menu-submenu-arrow{
      color: ${(props: IThemeProps) =>
        props?.theme?.colors?.sidebarListActiveText} !important;

}
  }
}

.ant-menu-submenu-selected-parent{
        background-color: ${(props: IThemeProps) =>
          props?.theme?.colors?.sidebarListActive} !important;
          color: ${(props: IThemeProps) =>
            props?.theme?.colors?.sidebarListActiveText} !important

}

/* for sidebar */

.ant-menu-submenu:after{
  position: absolute;
  content: "";
  left: -8px;
  top: 8px;
  height: 100px;
  width: 100px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid ${(props: IThemeProps) =>
    props?.theme?.colors?.sidebarBg};
}

/* **** ANTD DROPDOWN MENU ***** */

.ant-select-dropdown{
  background-color: ${(props: IThemeProps) =>
    props?.theme?.colors?.selectOptionBg};

.ant-select-item{
  color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};

}

/* .ant-select-item-option-selected:not(.ant-select-item-option-disabled)
  
} */

.ant-select-item-option-active:not(.ant-select-item-option-disabled){
  background-color: ${(props: IThemeProps) =>
    props?.theme?.colors?.sidebarListActive};
color: ${(props: IThemeProps) => props?.theme?.colors?.sidebarListActiveText}
}
.ant-select-item-option-selected:not(.ant-select-item-option-disabled){
  background-color: ${(props: IThemeProps) =>
    props?.theme?.colors?.sidebarListActive} ;
    color: ${(props: IThemeProps) =>
      props?.theme?.colors?.sidebarListActiveText}
  
}
}

.default-text{
  color: ${(props: IThemeProps) => props?.theme?.colors?.sidebarDefaultText};
}

.ant-breadcrumb a, .ant-breadcrumb-separator{
  color: ${(props: IThemeProps) => props?.theme?.colors?.breadCrumbs} ;
}

.ant-breadcrumb  span:last-child{
  color: ${(props: IThemeProps) =>
    props?.theme?.colors?.breadCrumbsActive} !important;
  
}

.bold{
  font-weight: 600;
}
.ant-select-dropdown{
  background-color: ${(props: IThemeProps) =>
    props?.theme?.colors?.cardBg} !important;
}



`;

export default GlobalStyle;
