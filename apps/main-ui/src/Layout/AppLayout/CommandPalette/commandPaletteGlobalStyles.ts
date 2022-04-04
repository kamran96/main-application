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
  width: 605px;
  position: absolute;
  top: 80px;
  left: 50%;
  right: auto;
  bottom: auto;
  border: 0px none;
  background: ${(props: IThemeProps) => props?.theme?.colors?.cmdbg};
  overflow: hidden;
  border-radius: 4px;
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
  color: #FFFFFF;
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
  min-width: 600px;
}

.invyce-container {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: lighter;
  font-size: 12px;
}

.invyce-containerOpen {
}

.invyce-input {
  font-size: 16px;
  border-radius: 4px;
  border: 1.5px solid #1e5490;
  width: ${convertToRem(530)};
  padding: 21px 19px;
  outline: none;
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.itmbg};
  color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
  caret-color: #4b4b4b;
  margin: 24px 24px 10px 36px;
}

.invyce-inputOpen {
}

.invyce-inputFocused {
  border: 1px solid #1E75F1;
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.inptFocusedBg};
}

.invyce-suggestionsContainer {
}

.invyce-suggestionsContainerOpen {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 315px;
  margin-top: 10px;
}

.invyce-suggestionsList {
  list-style: none;
  padding: 0;
  margin-bottom: 0;
  margin-top: 0;
}

.invyce-suggestion {
  color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.itmbg};
  cursor: pointer;
  font-size: 16px;
  font-weight: normal;
  width: ${convertToRem(530)};
  margin: 8px 24px;
  padding: 21px 19px;
  margin: 8px 32px 8px 36px;
  border-radius: 6px;
}

.invyce-suggestion b {
  color: #454545;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
}
.invyce-suggestionFirst {
}

.invyce-suggestionHighlighted {
  color: #ffffff;
  background-color: #1E75F1;
}

.invyce-spinner {
  border-top: 0.4em solid rgba(255, 255, 255, 0.2);
  border-right: 0.4em solid rgba(255, 255, 255, 0.2);
  border-bottom: 0.4em solid rgba(255, 255, 255, 0.2);
  border-left: 0.4em solid rgb(255, 255, 255);
}


`;

export default CommandPlatteGlobalStyles;
