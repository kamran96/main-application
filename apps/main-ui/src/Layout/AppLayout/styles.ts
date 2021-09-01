import { DivProps } from './../../modal/html';
import { IThemeProps } from "./../../hooks/useTheme/themeColors";
import styled, { keyframes } from "styled-components";
import convertToRem from "../../utils/convertToRem";

export const ContentArea = styled.section`
  background: ${(props: IThemeProps) => props.theme.colors.layoutBg};
  padding-top: ${convertToRem(22)};
  height: calc(100vh - 28px);
  transition: 0.4s all ease-in-out;
  /* margin-left: ${(props: IThemeProps) =>
    props?.theme?.toggle ? convertToRem(206) : convertToRem(65)}; */
  width: 100%;
  overflow-y: auto;
  .content {
    padding: 0rem 1.25rem 1.125rem 1.25rem;
    transition: 0.2s all ease-in-out;
  }

  .rightbar-space-370px {
    padding-right: 370px !important;
  }

  @media (max-width: 1365px) {
    padding-top: ${convertToRem(40)};
  }
`;

const animateRotate = keyframes`
    0% {
        transform: rotate(180deg)
      }
      100%{
      transform: rotate(360deg)
    }

`;

interface IApplayoutWrapperProps extends DivProps{
  darkModeLoading: boolean
}

export const WrapperApplayout = styled.div<IApplayoutWrapperProps>`
  .layout {
    display: flex;
    overflow: hidden;
  }

  .dark-mode-loading {
    transition: 0.2s all ease-in-out;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: ${(props: IThemeProps) => props.theme.colors.$WHITE};
    z-index: ${(props: IThemeProps) => (props.darkModeLoading ? 11111 : -1)};
    /* opacity: 1; */
    display: ${(props: IThemeProps) =>
      props.darkModeLoading ? "flex" : "none"};
    align-items: center;
    justify-content: center;
    color: ${(props: IThemeProps) => props.theme.colors.$BLACK};

    .icon-darkmode svg {
      transition: 0.2s all ease-in-out;
      font-size: ${convertToRem(50)};

      color: ${(props: IThemeProps) => props.theme.colors.$BLACK};
      /* animation: 0.4s ${animateRotate} all linear; */
      /* transition: 03s all ease-in-out; */
    }
  }
`;


interface INewUserContentAreaProps extends DivProps{
layoutChanged:boolean
}

export const NewUserContentArea = styled.div<INewUserContentAreaProps>`
  background: #efefef;
  height: max-content;
  min-height: 100vh;

  .content {
    transition: 0.4s all ease-in-out;
  }

  ${(props: any) =>
    props?.layoutChanged
      ? `
      padding-top: ${convertToRem(71)};
      .content{

        padding: ${convertToRem(50)} ${convertToRem(20)} ${convertToRem(
          50
        )} 1.25rem;
      }
   
    `
      : ``}
`;
