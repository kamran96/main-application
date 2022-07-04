import { IThemeProps } from './../../../hooks/useTheme/themeColors';
import { createGlobalStyle } from 'styled-components';
import convertToRem from '../../../utils/convertToRem';

const CommandPlatteGlobalStyles = createGlobalStyle`
.react-command-palette{
  visibility: hidden;
  width: 0;
  height: 0;
}
.invyce-modal {
  width: 600px;
  position: absolute;
  top: 80px;
  left: 50%;
  right: auto;
  bottom: auto;
  border: 0px none;
  background: ${(props: IThemeProps) => props?.theme?.colors?.cmdbg};
  overflow: hidden;
  border-radius: 8px;
  outline: none;
  box-shadow: #353535 0px 2px 4px 0px;
  margin-right: -50%;
  transform: translate(-50%, 0px);
  .wrapper-palate {
    display: flex;
    flex-direction: column-reverse;
  }
}

.invyce-overlay {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 99999;
}

.invyce-header {
  color: ${(props: IThemeProps) => props?.theme?.colors?.palateBtnColor};
  padding: 4px 0;
}

.invyce-content {
  box-shadow: rgb(0, 0, 0) 0px 2px 4px 0px;
  position: absolute;
  top: 80px;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, 0);
  border: 0px none;
  background: rgb(48, 51, 56);
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  border-radius: 4px;
  outline: none;
  padding: 10px;
}

.invyce-container {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: lighter;
  font-size: 12px;
  position: relative;

  }
  .crossBtn{
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
    svg path{
      fill: ${(props: IThemeProps) => props?.theme?.colors?.crossBtn};  
    }
  }
  .hide{
    display: none;
  }
}

.invyce-containerOpen {
}

.invyce-input {
  font-size: 18px;
  font-family: Poppins;
  border: none;
  width: 100%;
  padding: 20px 35px;
  outline: none;
  background: ${(props: IThemeProps) => props?.theme?.colors?.cmdbg};
  color: ${(props: IThemeProps) => props?.theme?.colors?.itmHoverText};
  caret-color: #4b4b4b;
  border-bottom: 1px solid ${(props: IThemeProps) =>
    props?.theme?.colors?.paletteBorder};
}

.invyce-inputOpen {
}

.invyce-inputFocused {
   border: none;
   border-bottom: 1px solid ${(props: IThemeProps) =>
     props?.theme?.colors?.paletteBorder};
}

.invyce-suggestionsContainer {

  .SearchHeader {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-transform: capitalize;
    color: #757375;
    padding: 14px;
    margin: 0 0 0 30px;
  }
}

.invyce-suggestionsContainerOpen {
  overflow-y: auto;
  overflow-x: hidden;
}

.invyce-suggestionsList {
  list-style: none;
  padding: 0;
  margin-bottom: 0;
  max-height:220px;
}

.invyce-suggestion {
  color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
  background: ${(props: IThemeProps) => props?.theme?.colors?.cmdbg};
  font-family: Poppins;
  cursor: pointer;
  font-size: 16px;
  line-height:24px;
  font-weight: 400;
  width: ${convertToRem(530)};
  padding: 14px 35px;
  width: 100%;
  border-left: 3px solid transparent;

  
  
  .icons{
    height: 28px;
    width: 28px;
    border-radius: 50%;
    background: ${(props: IThemeProps) => props?.theme?.colors?.svgBg};
    display: flex;
    align-items: center;
    justify-content: center;
    }
    .icons svg path{
      font-weight: 400;
      color: #${(props: IThemeProps) => props?.theme?.colors?.svgColor};
    }
}

.invyce-suggestion b {
  // color: #454545;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
}
.invyce-suggestionFirst {
}

.invyce-suggestionHighlighted {
  color: ${(props: IThemeProps) => props?.theme?.colors?.itmHoverText};
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.itmHover};
  border-left: 3px solid #1E75F1;
  font-weight: 500;

  .icons {
    background: ${(props: IThemeProps) => props?.theme?.colors?.svgHoverBg};
  }

  .icons svg path{
  font-weight: 500;
  color: ${(props: IThemeProps) => props?.theme?.colors?.svgHoverColor};
  }
}

.invyce-spinner {
  border-top: 0.4em solid rgba(255, 255, 255, 0.2);
  border-right: 0.4em solid rgba(255, 255, 255, 0.2);
  border-bottom: 0.4em solid rgba(255, 255, 255, 0.2);
  border-left: 0.4em solid rgb(255, 255, 255);
}


`;

export default CommandPlatteGlobalStyles;
