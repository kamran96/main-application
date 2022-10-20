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
  sidebarHoverActive: string;
  sidebarHoverActiveText: string;
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
  palateBtnColor: string;
  inptFocusedBg: string;
  itmHover: string;
  itmHoverText: string;
  crossBtn: string;
  paletteBorder: string;
  svgColor: string;
  svgBg: string;
  svgHoverBg: string;
  svgHoverColor: string;
  organizationCard: string;
  linkColor: string;
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

enum IPrimaryColor {}

export enum LightColors {
  $PRIMARY = '#7988ff',
  $Secondary = '#7988ff', //#143C69
  topbar = '#143C69',
  $BLACK = '#000000',
  $LIGHT_BLACK = '#272727',
  $LOGO = '#3D3D3D',
  $TEXT = '#141414',
  $GRAY = '#767676',
  $THEME_RED = '#f75151',
  $WHITE = '#ffff',
  $GRAY_LIGHT = '#808080',
  $SIDEBAR = `rgba(62, 62, 60, 0.75)`,
  $CHECK_BOX = '#DEDEDE',
  $Primary2 = `#1e5b9e`,
  layoutBg = `#efefef`,
  sidebarBg = '#ffff',
  sidebarListActive = '#F6FAFF', //sidebar
  sidebarListActiveText = '#7988FF',
  sidebarDefaultText = '#334d6e',
  tableRowHover = '#151515',
  td = `#ffff`,
  seprator = '#F4F4F4',
  bgTh = `#fafafa`,
  textTd = `#272727`,
  modalOverlay = `rgba(0, 0, 0, 0.45)`,
  placeHolder = `#697781`,
  inputColor = `rgba(0, 0, 0, 0.85)`,
  inputColorBg = ``,
  antIcon = ``,
  disabled = `#f5f5f5`,
  formLabel = `#4a4a4a`,
  primaryButtonBg = ``,
  primaryButtonColor = '',
  defaultButtonBg = ``,
  defaultButtonColor = '',
  buttonTagBg = `#e4e4e4`,
  buttonTagColor = `#333333`,
  buttonDisabledBg = ``,
  buttonDisabledText = ``,
  tabBgActive = '#7988ff',
  tabsBg = ``,
  paginationBg = ``,
  paginationColor = '',
  selectOptionBg = '',
  selectHoverList = ``,
  breadCrumbs = ``,
  breadCrumbsActive = '',
  fallbackLoader = '#ffffff8c',
  cmdbg = '#FFFFFF',
  cardBg = '#ffffff',
  stroke = '#F2F2F2',
  itmbg = '#F4F4F5',
  itmText = '#454545',
  paletteBtn = '#F3F3F3',
  palateBtnColor = '#67656A',
  inptFocusedBg = '#F4F4F5',
  itmHover = 'rgba(148, 188, 247, 0.31)',
  itmHoverText = '#232C3A',
  crossBtn = 'rgba(105, 119, 129, 0.8)',
  paletteBorder = '##EEEEEE',
  svgColor = '#485161',
  svgBg = '#EFF3F8',
  svgHoverBg = '#FBFDFF',
  svgHoverColor = '#232C3A',
  organizationCard = '#dff0ff',
  sidebarHoverActive = '#F6FAFF',
  sidebarHoverActiveText = '#7988FF',
  linkColor = '#7988ff',
}

export enum DarkColors {
  $PRIMARY = '#e4e4e4',
  $Secondary = '#ffffff',
  topbar = '#121212',
  $BLACK = '#e4e4e4',
  $LIGHT_BLACK = '#a0a0a0',
  $LOGO = '#3D3D3D',
  $TEXT = '#141414',
  $GRAY = '#767676',
  $THEME_RED = '#f75151',
  $WHITE = '#000000',
  $GRAY_LIGHT = '#808080',
  $SIDEBAR = `rgba(62, 62, 60, 0.75)`,
  $CHECK_BOX = '#DEDEDE',
  $Primary2 = `#1e5b9e`,
  layoutBg = `#040B10;`,
  sidebarBg = '#0B1822',
  sidebarListActiveText = '#FFFFFF',
  sidebarListActive = '#060E16',
  sidebarDefaultText = ` #CED3DA;`,
  tableRowHover = '#fafafa',
  td = `#08131D`,
  bgTh = `#060e15`,
  textTd = `rgba(255, 255, 255, 0.6)`,
  seprator = `#1e1e1e`,
  modalOverlay = `rgb(128 128 128 / 45%)`,
  placeHolder = `#CFD9DF`,
  inputColor = `rgb(125 125 125)`,
  antIcon = `#6b6b6b`,
  disabled = `rgb(134 134 134 / 25%)`,
  formLabel = `rgba(255,255,255,0.6)`,
  primaryButtonBg = `#4a4a4a`,
  primaryButtonColor = `#d5d5d5`,
  defaultButtonBg = `#4a4a4a`,
  defaultButtonColor = `#d5d5d5`,
  buttonTagBg = `#4a4a4a`,
  buttonTagColor = `#d5d5d5`,
  buttonDisabledBg = `#3f3f3f4d`,
  buttonDisabledText = `rgb(153 153 153 / 25%)`,
  tabsBg = `#4a4a4a`,
  tabBgActive = '#b1b1b1',
  paginationColor = `#e4e4e4`,
  paginationBg = '#4a4a4a',
  selectOptionBg = `#121212`,
  selectHoverList = `#171717`,
  breadCrumbsActive = 'rgb(228 228 228 / 89%)',
  breadCrumbs = 'rgb(152 152 152 / 68%)',
  fallbackLoader = '#282828',
  inputColorBg = `#121212`,
  cmdbg = `#111727`,
  cardBg = '#0B1822',
  stroke = '#222e39',
  itmbg = '#08131D',
  itmText = '#FFFFFF',
  paletteBtn = '#272D3F',
  palateBtnColor = '#DFDFDF',
  inptFocusedBg = '#08131D',
  itmHover = '#202938',
  itmHoverText = '#FFFFFF',
  crossBtn = '#FFFFFF',
  paletteBorder = '#273048',
  svgColor = '#667284',
  svgBg = '#242B3E',
  svgHoverBg = '#434D5E',
  svgHoverColor = '#FFFFFF',
  organizationCard = '#0B1822',
  sidebarHoverActive = '#FFFFFF',
  sidebarHoverActiveText = '#FFFFFF',
  linkColor = '#7988ff',
}

export const Themes: IThemes = {
  light: {
    $PRIMARY: LightColors.$PRIMARY,
    $Secondary: LightColors.$Secondary,
    topbar: LightColors.topbar,
    $BLACK: LightColors.$BLACK,
    $LIGHT_BLACK: LightColors.$LIGHT_BLACK,
    $LOGO: LightColors.$LOGO,
    $TEXT: LightColors.$TEXT,
    $GRAY: LightColors.$GRAY,
    $THEME_RED: LightColors.$THEME_RED,
    $WHITE: LightColors.$WHITE,
    $GRAY_LIGHT: LightColors.$GRAY_LIGHT,
    $SIDEBAR: LightColors.$SIDEBAR,
    $CHECK_BOX: LightColors.$CHECK_BOX,
    $Primary2: LightColors.$Primary2,
    layoutBg: LightColors.layoutBg,
    sidebarBg: LightColors.sidebarBg,
    sidebarListActive: LightColors.sidebarListActive,
    sidebarListActiveText: LightColors.sidebarListActiveText,
    sidebarDefaultText: LightColors.sidebarDefaultText,
    tableRowHover: LightColors.tableRowHover,
    td: LightColors.td,
    seprator: LightColors.seprator,
    bgTh: LightColors.bgTh,
    textTd: LightColors.textTd,
    modalOverlay: LightColors.modalOverlay,
    placeHolder: LightColors.placeHolder,
    inputColor: LightColors.inputColor,
    inputColorBg: LightColors.inputColorBg,
    antIcon: LightColors.antIcon,
    disabled: LightColors.disabled,
    formLabel: LightColors.formLabel,
    primaryButtonBg: LightColors.primaryButtonBg,
    primaryButtonColor: LightColors.primaryButtonColor,
    defaultButtonBg: LightColors.defaultButtonBg,
    defaultButtonColor: LightColors.defaultButtonColor,
    buttonTagBg: LightColors.buttonTagBg,
    buttonTagColor: LightColors.buttonTagColor,
    buttonDisabledBg: LightColors.buttonDisabledBg,
    buttonDisabledText: LightColors.buttonDisabledText,
    tabBgActive: LightColors.tabBgActive,
    tabsBg: LightColors.tabsBg,
    paginationBg: LightColors.paginationBg,
    paginationColor: LightColors.paginationColor,
    selectOptionBg: LightColors.selectOptionBg,
    selectHoverList: LightColors.selectHoverList,
    breadCrumbs: LightColors.breadCrumbs,
    breadCrumbsActive: LightColors.breadCrumbsActive,
    fallbackLoader: LightColors.fallbackLoader,
    cmdbg: LightColors.cmdbg,
    cardBg: LightColors.cardBg,
    stroke: LightColors.stroke,
    itmbg: LightColors.itmbg,
    itmText: LightColors.itmText,
    paletteBtn: LightColors.paletteBtn,
    palateBtnColor: LightColors.palateBtnColor,
    inptFocusedBg: LightColors.inptFocusedBg,
    itmHover: LightColors.itmHover,
    itmHoverText: LightColors.itmHoverText,
    crossBtn: LightColors.crossBtn,
    paletteBorder: LightColors.paletteBorder,
    svgColor: LightColors.svgColor,
    svgBg: LightColors.svgBg,
    svgHoverBg: LightColors.svgHoverBg,
    svgHoverColor: LightColors.svgHoverColor,
    organizationCard: LightColors.organizationCard,
    sidebarHoverActive: LightColors.sidebarHoverActive,
    sidebarHoverActiveText: LightColors.sidebarHoverActiveText,
    linkColor: LightColors.linkColor,
  },
  dark: {
    $PRIMARY: DarkColors.$PRIMARY,
    $Secondary: DarkColors.$Secondary,
    topbar: DarkColors.topbar,
    $BLACK: DarkColors.$BLACK,
    $LIGHT_BLACK: DarkColors.$LIGHT_BLACK,
    $LOGO: DarkColors.$LOGO,
    $TEXT: DarkColors.$TEXT,
    $GRAY: DarkColors.$GRAY,
    $THEME_RED: DarkColors.$THEME_RED,
    $WHITE: DarkColors.$WHITE,
    $GRAY_LIGHT: DarkColors.$GRAY_LIGHT,
    $SIDEBAR: DarkColors.$SIDEBAR,
    $CHECK_BOX: DarkColors.$CHECK_BOX,
    $Primary2: DarkColors.$Primary2,
    layoutBg: DarkColors.layoutBg,
    sidebarBg: DarkColors.sidebarBg,
    sidebarListActiveText: DarkColors.sidebarListActiveText,
    sidebarListActive: DarkColors.sidebarListActive,
    sidebarDefaultText: DarkColors.sidebarDefaultText,
    tableRowHover: DarkColors.tableRowHover,
    td: DarkColors.td,
    bgTh: DarkColors.bgTh,
    textTd: DarkColors.textTd,
    seprator: DarkColors.seprator,
    modalOverlay: DarkColors.modalOverlay,
    placeHolder: DarkColors.placeHolder,
    inputColor: DarkColors.inputColor,
    antIcon: DarkColors.antIcon,
    disabled: DarkColors.disabled,
    formLabel: DarkColors.formLabel,
    primaryButtonBg: DarkColors.primaryButtonBg,
    primaryButtonColor: DarkColors.primaryButtonColor,
    defaultButtonBg: DarkColors.defaultButtonBg,
    defaultButtonColor: DarkColors.defaultButtonColor,
    buttonTagBg: DarkColors.buttonTagBg,
    buttonTagColor: DarkColors.buttonTagColor,
    buttonDisabledBg: DarkColors.buttonDisabledBg,
    buttonDisabledText: DarkColors.buttonDisabledText,
    tabsBg: DarkColors.tabsBg,
    tabBgActive: DarkColors.tabBgActive,
    paginationColor: DarkColors.paginationColor,
    paginationBg: DarkColors.paginationBg,
    selectOptionBg: DarkColors.selectOptionBg,
    selectHoverList: DarkColors.selectHoverList,
    breadCrumbsActive: DarkColors.breadCrumbsActive,
    breadCrumbs: DarkColors.breadCrumbs,
    fallbackLoader: DarkColors.fallbackLoader,
    inputColorBg: DarkColors.inputColorBg,
    cmdbg: DarkColors.cmdbg,
    cardBg: DarkColors.cardBg,
    stroke: DarkColors.stroke,
    itmbg: DarkColors.itmbg,
    itmText: DarkColors.itmText,
    paletteBtn: DarkColors.paletteBtn,
    palateBtnColor: DarkColors.palateBtnColor,
    inptFocusedBg: DarkColors.inptFocusedBg,
    itmHover: DarkColors.itmHover,
    itmHoverText: DarkColors.itmHoverText,
    crossBtn: DarkColors.crossBtn,
    paletteBorder: DarkColors.paletteBorder,
    svgColor: DarkColors.svgColor,
    svgBg: DarkColors.svgBg,
    svgHoverBg: DarkColors.svgHoverBg,
    svgHoverColor: DarkColors.svgHoverColor,
    organizationCard: DarkColors.organizationCard,
    sidebarHoverActive: DarkColors.sidebarHoverActive,
    sidebarHoverActiveText: DarkColors.sidebarHoverActiveText,
    linkColor: DarkColors.linkColor,
  },
};
