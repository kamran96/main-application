import { IThemeProps } from './../../../hooks/useTheme/themeColors';
import { createGlobalStyle } from 'styled-components';

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
  padding: 15px 20px;
  box-shadow: #353535 0px 2px 4px 0px;
  margin-right: -50%;
  transform: translate(-50%, 0px);
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
  color: #d7dae0;
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
  font-size: 14px;
  border-radius: 4px;
  border: 1.5px solid #1e5490;
  width: 100%;
  padding: 6px;
  outline: none;
  background-color: #e5e5e5;
  color: #111111;
  caret-color: #4b4b4b;
}

.invyce-inputOpen {
}

.invyce-inputFocused {
  border: 1px solid #143c69;
  background-color: #e5e5e5;
}

.invyce-suggestionsContainer {
}

.invyce-suggestionsContainerOpen {
  overflow-y: auto;
  overflow-x: hidden;
  border-top: 1px solid ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? props?.theme?.colors?.seprator
      : '#cbcccd'};
  border-bottom: 1px solid ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? props?.theme?.colors?.seprator
      : '#cbcccd'};
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
  color: ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? props?.theme?.colors?.sidebarDefaultText
      : '#3d3d3d'};
  border-left: 1px solid ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? props?.theme?.colors?.seprator
      : '#cbcccd'};
  border-right: 1px solid ${(props: IThemeProps) =>
    props?.theme?.theme === 'dark'
      ? props?.theme?.colors?.seprator
      : '#cbcccd'};
  border-top: 0px none;
  background-color: ${(props: IThemeProps) => props?.theme?.colors?.cmdbg};
  cursor: pointer;
  font-size: 13px;
  font-weight: normal;
}

.invyce-suggestion b {
  color: #8b8b8b;
  font-weight: bold;
}
.invyce-suggestionFirst {
}

.invyce-suggestionHighlighted {
  color: #ffffff;
  background-color: #1e5490;
}

.invyce-spinner {
  border-top: 0.4em solid rgba(255, 255, 255, 0.2);
  border-right: 0.4em solid rgba(255, 255, 255, 0.2);
  border-bottom: 0.4em solid rgba(255, 255, 255, 0.2);
  border-left: 0.4em solid rgb(255, 255, 255);
}


`;

export default CommandPlatteGlobalStyles;
