import styled from 'styled-components';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';

type DivProps = JSX.IntrinsicElements['div'];

interface ModalWrapper extends DivProps {
  step?: number;
}

export const WrapperModalContent = styled.div<ModalWrapper>`
  display: flex;
  padding-bottom: 1rem;

  .container {
    transition: 0.6s all ease-in-out;
    width: ${(props: any) => (props?.step === 1 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 1 ? 1 : 0)};
    display: ${(props: any) =>
      props?.step === 1 ? 'flex' : 'none'} !important;
    align-items: center;
    min-height: 0;
    flex-direction: column;
    transform: ${(props: any) =>
      props?.step === 2 ? 'translateX(-100%)' : 'translateX(0)'};
  }

  .CompareModal {
    width: ${(props: any) => (props?.step === 2 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 2 ? 1 : 0)};
    display: ${(props: any) => (props?.step === 2 ? 'block' : 'none')};
    transform: ${(props: any) =>
      props?.step === 2
        ? 'translateX(0)'
        : props?.step === 3
        ? 'translateX(-100%)'
        : 'translateX(100%)'};
    transition: 0.4s ease-in-out;
    color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
  }
  .TableWrapper {
    width: ${(props: any) => (props?.step === 3 ? '100%' : 0)};
    opacity: ${(props: any) => (props?.step === 3 ? 1 : 0)};
    display: ${(props: any) => (props?.step === 3 ? 'block' : 'none')};
    transform: ${(props: any) =>
      props?.step === 3 ? 'translateX(0)' : 'translateX(100%)'};
    transition: 0.4s ease-in-out;
    min-height: 70vh !important;
    overflow-y: scroll;

    .CnfrmBtn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .btn {
      margin: 15px 4px 4px 4px;
    }
  }
  .modal-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(35, 149, 231, 0.08);
    width: 222px;
    height: 222px;
    margin-bottom: 44px;
  }
  .modal-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 17px;
    color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};
    h2 {
      margin: 0px 0px 0px 10px;
      font: 500 18px/27px Poppins;
    }
  }
  .modal-btns {
    margin: 0px 0px 14px 0px;
    button {
      background: #d8d8d8;
      border-radius: 4px;
      font: normal normal normal 18px/24px Poppins;
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: capitalize;
      color: #2d2d2d;
      border: none;
      width: 9.5rem;
      padding: 10px 0px;
      margin: 7px;
      cursor: pointer;
    }
    .active {
      background: #2395e7;
      box-shadow: 0px 6px 30px rgba(3, 3, 3, 0.2);
      color: white;
    }
  }
  .render-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    .download {
      margin: 0px 0px 44px 15px;
      display: flex;
      align-items: center;
      h4 {
        font: normal normal normal 13px/19px Poppins;
        color: ${(props: IThemeProps) => props?.theme?.colors?.itmText};

        margin: 0px;
      }
      a {
        cursor: pointer;
      }
    }
    .btn {
      margin-left: 90%;
      margin-top: 2rem;
    }
    .input {
      margin: 0px 0px 8px 15px;
      display: flex;
      align-items: center;
      .Icon {
      }
      .input-label {
        font: 500 15px/22px Poppins;
        color: #2395e7;
        margin-left: 12px;
        cursor: pointer;
        input {
          display: none;
        }
      }
    }
    .text {
      margin: 0px 0px 14px 15px;

      p {
        font: normal 13px/21px Poppins;
      }
    }
    button {
      font: normal 14px/24px Poppins;
      text-align: center;
      letter-spacing: 0.02em;
      color: #ffffff;
      width: 8rem;
      border-radius: 4px;
      border: none;
      margin: 0px 0px 0px 15px;
    }
  }
`;
