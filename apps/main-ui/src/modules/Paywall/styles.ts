import styled, { createGlobalStyle } from 'styled-components';
import { CommonModal } from '../../components';

type DivProps = JSX.IntrinsicElements['div'];

interface WrapperPaywallProps extends DivProps {
  step?: Number;
}

export const WrapperPaywall = styled.div<WrapperPaywallProps>`
  overflow: hidden;
  .main-wrapper {
    display: flex;
    overflow-x: hidden;
    transition: 0.6s all ease-in-out;
    margin-left: ${(props: any) => (props?.step === 2 ? '-1037px' : 0)};

    .package_screen {
      padding: 36px 0;
      transition: 0.4s all ease-in-out;
      opacity: ${(props: any) => (props?.step === 2 ? 0 : 1)};
    }
    .free_card {
      box-shadow: 23px 0px 24px 8px rgba(225, 222, 207, 0.2312);
      min-height: 434px;
      min-width: 336px;
      margin: 5px 10px;
      padding: 40px 40px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .package_description {
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 20px;
        margin: 2px 0;
        opacity: 0.6;
      }
      .package_offers {
        .list_packages li {
          margin: 7px 0;
          .icon {
            color: #174577;
            font-size: 19px;
          }
        }
      }

      .package_using h4 {
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.233333px;
        color: #174577;
      }
    }
    .premium_card {
      background: linear-gradient(180deg, #164273 0%, #2f71bb 100%);
      box-shadow: 0px 22px 24px rgba(78, 45, 146, 0.2837);
      min-height: 434px;
      min-width: 616px;
      max-width: 616px;
      margin: 5px 10px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px 40px 40px 40px;

      .package_switch {
        text-align: right;
        color: white;
      }

      .premium_card_content {
        .premium_heading {
          font-style: normal;
          font-weight: 600;
          font-size: 26px;
          /* line-height: 60px; */
          /* identical to box height */

          color: #ffffff;
        }
        .package_description {
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          line-height: 20px;
          margin: 2px 0;
          color: #ffffff;

          mix-blend-mode: normal;
          opacity: 0.4;
        }
      }

      .premium_offers {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 50%;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          line-height: 22px;
          margin: 5px 0;
          /* identical to box height */

          color: #ffffff;
          .icon {
            font-size: 19px;
          }
        }
      }
    }

    .list_packages {
      padding: 0;
      margin-top: 37px;
      li {
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 22px;
      }
    }

    .package_button {
      button {
        background: #f9f2ff;
        border-radius: 26px !important;
        text-align: center;
        -webkit-letter-spacing: -0.233333px;
        -moz-letter-spacing: -0.233333px;
        -ms-letter-spacing: -0.233333px;
        letter-spacing: -0.233333px;
        color: #174577;
        border: none;
        min-width: 275px;
        font-weight: bold;
        font-size: 14px;
      }
    }

    .payment_screen {
      display: flex;

      color: black;
      margin-left: 45px;
      max-width: 955px;
      min-width: 955px;
      transition: 0.4s all ease-in-out;
      opacity: ${(props: any) => (props?.step === 1 ? 0 : 1)};
      .payment-form {
        padding: 20px 45px;
        .payment-heading {
          margin-left: -36px;
          padding-bottom: 8px;
        }
        .form {
          margin-top: 54px;
          .payment-input {
            background: #ffffff;
            box-shadow: 0px 4px 12px rgba(158, 168, 189, 0.31);
            border-radius: 10px;
            width: 100%;
          }

          .note {
            font-size: 12px;
            text-align: center;
          }

          .payment_submit_button {
            width: 100%;
            color: white;
            transition: 0.4s all ease-in-out;
            background: linear-gradient(180deg, #164273 0%, #2f71bb 100%);

            &:hover {
              transition: 0.4s all ease-in-out;
              background: linear-gradient(-180deg, #164273 0%, #2f71bb 100%);
            }
          }
        }
        .go-back {
          font-size: 26px;
          cursor: pointer;
        }
      }

      .illustration {
        background: linear-gradient(180deg, #164273 0%, #2f71bb 100%);
        min-width: 627px;
        text-align: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        margin-right: -48px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          max-width: 70%;
          height: auto;
        }
      }
    }
  }
`;

export const PaywallModal = styled(CommonModal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    padding: 0;
  }
`;
