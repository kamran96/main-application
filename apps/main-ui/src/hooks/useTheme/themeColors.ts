export interface IThemeVariables {
  $PRIMARY: string;
  $Secondary: string;
  $BLACK: string;
  $LIGHT_BLACK: string;
  $LOGO: string;
  $TEXT: string;
  $GRAY: string;
  $THEME_RED: string;
  $WHITE: string;

  $GRAY_LIGHT: string;
  $SIDEBAR: string;
  $CHECK_BOX: string;
  $Primary2: string;
  layoutBg: string;
  sidebarBg: string;
  sidebarListActive: string;
  sidebarListActiveText: string;
  sidebarDefaultText: string;
  tableRowHover: string;
  td: string;
  seprator: string;
  bgTh: string;
  textTd: string;
  modalOverlay: string;
  placeHolder: string;
  inputColor: string;
  inputColorBg: string;
  antIcon: string;
  disabled: string;
  formLabel: string;
  primaryButtonBg: string;
  primaryButtonColor: string;
  defaultButtonBg: string;
  defaultButtonColor: string;
  buttonTagBg: string;
  buttonTagColor: string;
  buttonDisabledBg: string;
  buttonDisabledText: string;
  tabsBg: string;
  paginationBg: string;
  paginationColor: string;
  selectOptionBg: string;
  selectHoverList: string;
  breadCrumbs: string;
  breadCrumbsActive: string;
  fallbackLoader: string;
  topbar: string;
  cmdbg: string;
  cardBg: string;
  stroke: string;
  tabBgActive: string;
  itmbg: string;
  itmText: string;
  paletteBtn: string;
  inptFocusedBg: string;
}

export interface ITheme {
  colors: IThemeVariables;
  toggle?: boolean;
  theme: 'dark' | 'light';
  [key: string]: any;
}

export interface IThemeProps {
  theme: ITheme;
  [key: string]: any;
}

interface IThemes {
  light: IThemeVariables;
  dark: IThemeVariables;
}

export const Themes: IThemes = {
  light: {
    $PRIMARY: '#1890ff',
    $Secondary: '#143C69',
    topbar: '#143C69',
    $BLACK: '#000000',
    $LIGHT_BLACK: '#272727',
    $LOGO: '#3D3D3D',
    $TEXT: '#141414',
    $GRAY: '#767676',
    $THEME_RED: '#f75151',
    $WHITE: '#ffff',
    $GRAY_LIGHT: '#808080',
    $SIDEBAR: `rgba(62, 62, 60, 0.75)`,
    $CHECK_BOX: '#DEDEDE',
    $Primary2: `#1e5b9e`,
    layoutBg: `#efefef`,
    sidebarBg: '#ffff',
    sidebarListActive: '#1E75F1',
    sidebarListActiveText: '#ffff',
    sidebarDefaultText: '#334d6e',
    tableRowHover: '#151515',
    td: `#ffff`,
    seprator: '#F4F4F4',
    bgTh: `#fafafa`,
    textTd: `#272727`,
    modalOverlay: `rgba(0, 0, 0, 0.45)`,
    placeHolder: `#6D7D88`,
    inputColor: `rgba(0, 0, 0, 0.85)`,
    inputColorBg: ``,
    antIcon: ``,
    disabled: ``,
    formLabel: `#4a4a4a`,
    primaryButtonBg: ``,
    primaryButtonColor: '',
    defaultButtonBg: ``,
    defaultButtonColor: '',
    buttonTagBg: `#e4e4e4`,
    buttonTagColor: `#333333`,
    buttonDisabledBg: ``,
    buttonDisabledText: ``,
    tabBgActive: '#1E75F1',
    tabsBg: ``,
    paginationBg: ``,
    paginationColor: '',
    selectOptionBg: '',
    selectHoverList: ``,
    breadCrumbs: ``,
    breadCrumbsActive: '',
    fallbackLoader: '#ffffff8c',
    cmdbg: '#FFFFFF',
    cardBg: '#ffffff',
    stroke: '#F2F2F2',
    itmbg: '#F4F4F5',
    itmText: '#454545',
    paletteBtn: '#1E75F1',
    inptFocusedBg: '#F4F4F5'
  },
  dark: {
    $PRIMARY: '#e4e4e4',
    $Secondary: '#000000',
    topbar: '#121212',
    $BLACK: '#e4e4e4',
    $LIGHT_BLACK: '#a0a0a0',
    $LOGO: '#3D3D3D',
    $TEXT: '#141414',
    $GRAY: '#767676',
    $THEME_RED: '#f75151',
    $WHITE: '#000000',
    $GRAY_LIGHT: '#808080',
    $SIDEBAR: `rgba(62, 62, 60, 0.75)`,
    $CHECK_BOX: '#DEDEDE',
    $Primary2: `#1e5b9e`,
    layoutBg: `#040B10;`,
    sidebarBg: '#0B1822',
    sidebarListActiveText: '#FFFFFF',
    sidebarListActive: '#060E16',
    sidebarDefaultText: ` #CED3DA;`,
    tableRowHover: '#fafafa',
    td: `#08131D`,
    bgTh: `#060e15`,
    textTd: `rgba(255, 255, 255, 0.6)`,
    seprator: `#1e1e1e`,
    modalOverlay: `rgb(128 128 128 / 45%)`,
    placeHolder: `#F0F0F0`,
    inputColor: `rgb(125 125 125)`,
    antIcon: `#6b6b6b`,
    disabled: `rgb(134 134 134 / 25%)`,
    formLabel: `rgba(255,255,255,0.6)`,
    primaryButtonBg: `#4a4a4a`,
    primaryButtonColor: `#d5d5d5`,
    defaultButtonBg: `#4a4a4a`,
    defaultButtonColor: `#d5d5d5`,
    buttonTagBg: `#4a4a4a`,
    buttonTagColor: `#d5d5d5`,
    buttonDisabledBg: `#3f3f3f4d`,
    buttonDisabledText: `rgb(153 153 153 / 25%)`,
    tabsBg: `#4a4a4a`,
    tabBgActive: '#b1b1b1',
    paginationColor: `#e4e4e4`,
    paginationBg: '#4a4a4a',
    selectOptionBg: `#121212`,
    selectHoverList: `#171717`,
    breadCrumbsActive: 'rgb(228 228 228 / 89%)',
    breadCrumbs: 'rgb(152 152 152 / 68%)',
    fallbackLoader: '#282828',
    inputColorBg: `#121212`,
    cmdbg: `#000000`,
    cardBg: '#0B1822',
    stroke: '#222e39',
    itmbg: '#08131D',
    itmText: '#FFFFFF',
    paletteBtn: '#08131D',
    inptFocusedBg: '#08131D'
  },
};
